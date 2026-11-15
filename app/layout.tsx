import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BếpSV - Gợi Ý Món Ăn Chuẩn Ví & Nhanh Gọn Cho Sinh Viên",
  description: "Website giúp sinh viên quyết định ăn gì trong vài giây: nhập số tiền trong ví hoặc nguyên liệu đang có, gợi ý món nấu dưới 20 phút, đủ chất và chống bỏ bữa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-[#F7F1EC] text-[#202B24]">
        {children}
      </body>
    </html>
  );
}
