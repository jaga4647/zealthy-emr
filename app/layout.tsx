"use client";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md p-4 flex justify-center gap-6 sticky top-0 z-50">
          <Link href="/patient" className="text-blue-700 font-semibold hover:underline">
            🏠 Dashboard
          </Link>
          <Link href="/appointments" className="text-blue-700 font-semibold hover:underline">
            📅 Appointments
          </Link>
          <Link href="/medications" className="text-blue-700 font-semibold hover:underline">
            💊 Prescriptions
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("patient");
              window.location.href = "/";
            }}
            className="text-red-600 font-semibold hover:underline"
          >
            🚪 Logout
          </button>
        </nav>

        {/* Page Content */}
        <main className="pt-8">{children}</main>
      </body>
    </html>
  );
}
