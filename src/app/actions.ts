'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateQuantity(id: string, quantity: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('items')
    .update({ quantity })
    .eq('id', id)

  if (error) {
    return error.message
  }

  revalidatePath('/dashboard')
}

export async function addItem(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const cost_price = formData.get('cost_price') ? parseFloat(formData.get('cost_price') as string) : null
  const selling_price = formData.get('selling_price') ? parseFloat(formData.get('selling_price') as string) : null

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Check user plan and item count
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan === 'free') {
    const { count } = await supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count && count >= 15) {
      return { error: 'Free plan limit reached (15 items). Upgrade to Pro to add more.' }
    }
  }

  // Check for duplicates
  const { data: existingItem } = await supabase
    .from('items')
    .select('id')
    .eq('user_id', user.id)
    .ilike('name', name)
    .single()

  if (existingItem) {
    return { error: 'Item with this name already exists.' }
  }

  const { error } = await supabase
    .from('items')
    .insert({
      name,
      quantity,
      cost_price,
      selling_price,
      user_id: user.id
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteItems(ids: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('items')
    .delete()
    .in('id', ids)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateItem(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const quantity = parseInt(formData.get('quantity') as string)
  const cost_price = formData.get('cost_price') ? parseFloat(formData.get('cost_price') as string) : null
  const selling_price = formData.get('selling_price') ? parseFloat(formData.get('selling_price') as string) : null

  const { error } = await supabase
    .from('items')
    .update({
      name,
      quantity,
      cost_price,
      selling_price
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateTheme(theme: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  await supabase
    .from('profiles')
    .update({ theme })
    .eq('id', user.id)
}

export async function upgradeToPro() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  await supabase
    .from('profiles')
    .update({ plan: 'pro' })
    .eq('id', user.id)

  revalidatePath('/dashboard')
}

import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLowStockAlerts() {
  console.log('Resend Key Present:', !!process.env.RESEND_API_KEY)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !user.email) return { error: 'Not authenticated' }

  // Get low stock items
  const { data: items } = await supabase
    .from('items')
    .select('name, quantity, low_stock_threshold')
    .eq('user_id', user.id)

  if (!items) return { success: true, message: 'No items found' }

  const lowStockItems = items.filter(item => item.quantity <= (item.low_stock_threshold || 3))

  if (lowStockItems.length === 0) {
    return { success: true, message: 'No items are low on stock' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Stockly <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Low Stock Alert - Action Required',
      react: EmailTemplate({ 
        firstName: user.user_metadata.full_name || 'Vendor', 
        lowStockItems: lowStockItems.map(i => ({ name: i.name, quantity: i.quantity })) 
      }) as React.ReactElement,
    });

    if (error) {
      return { error: error.message }
    }

    return { success: true, message: `Alert sent for ${lowStockItems.length} items` }
  } catch (error) {
    console.error('Resend Error:', error)
    return { error: 'Failed to send email: ' + (error as Error).message }
  }
}
