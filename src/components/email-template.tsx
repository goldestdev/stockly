import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  lowStockItems: { name: string; quantity: number }[];
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lowStockItems,
}) => (
  <div>
    <h1>Hi {firstName},</h1>
    <p>The following items are running low on stock:</p>
    <ul>
      {lowStockItems.map((item, index) => (
        <li key={index}>
          <strong>{item.name}</strong>: {item.quantity} left
        </li>
      ))}
    </ul>
    <p>Time to restock!</p>
    <p>
      <a href="https://stockly-app.vercel.app/dashboard">Go to Dashboard</a>
    </p>
  </div>
);
