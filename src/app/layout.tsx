import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthHydrator from "./_components/AuthHydrator";
import "./globals.scss";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tactify FC | The Analytical Engine",
  description:
    "엘리트 전술 시각화, 정밀한 선수 데이터, 그리고 완벽한 팀 동기화를 통해 코칭 스태프의 역량을 강화하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthHydrator />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#2a2a2c",
              color: "#e5e1e4",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: { primary: "#68dbae", secondary: "#003827" },
            },
            error: {
              iconTheme: { primary: "#ffb4ab", secondary: "#690005" },
            },
          }}
        />
      </body>
    </html>
  );
}
