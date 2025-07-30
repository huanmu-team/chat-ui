import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chat UI - Agent Comparison Dashboard',
  description: '并行测试两个 LangGraph 智能代理',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}