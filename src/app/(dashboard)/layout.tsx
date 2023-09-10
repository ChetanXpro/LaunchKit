import "src/app/globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "users dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <ul>
            <li>Profile</li>
            <li>Logout</li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
