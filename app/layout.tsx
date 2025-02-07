import "@/app/globals.css"
import { Inter } from "next/font/google"
import type React from "react" // Import React
import ToastProvider from "./ToastProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Notes",
  description: "voice notes to text",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}















// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "Notes AI",
//   description: "Assignment of TARS",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         {children}
//       </body>
//     </html>
//   );
// }
