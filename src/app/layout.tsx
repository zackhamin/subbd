import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "../components/ui/Header";
import { AuthProvider } from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RecruiterConnect - LinkedIn X Substack for Recruiting",
  description: "Connect with recruiters and find your next job opportunity",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-100 border-t py-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} RecruiterConnect. All rights reserved.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600">
                    About
                  </Link>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">
                    Contact
                  </Link>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                    Terms & Conditions
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}