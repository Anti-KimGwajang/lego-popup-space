import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'LEGO — Build Your Space',
  description: 'KINTEX LEGO 팝업 공간 디자인. 모듈, 연결, 참여로 완성하는 공간.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
