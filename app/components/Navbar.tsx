"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface NavbarProps {
  userType?: "patient" | "admin";
}

export default function Navbar({ userType }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("patient");
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={userType === "admin" ? "/admin" : "/patient"} className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
              Z
            </div>
            <span className="text-xl font-bold text-gray-800">Zealthy EMR</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {userType === "patient" && (
              <>
                <Link
                  href="/patient"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isActive("/patient")
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  🏠 Dashboard
                </Link>
                <Link
                  href="/appointments"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isActive("/appointments")
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  📅 Appointments
                </Link>
                <Link
                  href="/prescriptions"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isActive("/prescriptions")
                      ? "bg-purple-100 text-purple-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  💊 Prescriptions
                </Link>
              </>
            )}

            {userType === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActive("/admin")
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                🩺 Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              📤 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}