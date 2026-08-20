import type { Metadata } from "next";
import "./globals.css";

import { WorkspaceProvider } from "@/components/workspace-provider";
import { PRODUCT_NAME_ZH } from "@/lib/current-project";

export const metadata: Metadata = {
  title: PRODUCT_NAME_ZH,
  description: "企业 AI 解决方案一站式工作台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </body>
    </html>
  );
}
