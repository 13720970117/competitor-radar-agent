import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '竞品雷达 · AI 竞品分析 Agent',
  description: '输入三个竞品，生成七维对比、差异化建议与待核验清单。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
