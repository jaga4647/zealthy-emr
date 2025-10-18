"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Appointment {
  id: number;
  provider: string;
  date: string;
  repeat?: string;
  repeatEnd?: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("patient");
    const patient = stored ? JSON.parse(stored) : null;

    if (!patient || !patient.email) {
      router.push("/");
      return;
    }

    async function fetchAppointments() {
      try {
        const res = await fetch(`/api/appointments?email=${encodeURIComponent(patient.email)}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // Filter for next 3 months
          const now = new Date();
          const threeMonthsFromNow = new Date();
          threeMonthsFromNow.setMonth(now.getMonth() + 3);
          
          const filtered = data.filter((a: Appointment) => {
            const apptDate = new Date(a.date);
            return apptDate >= now && apptDate <= threeMonthsFromNow;
          });
          
          // Sort by date (nearest first)
          filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          setAppointments(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-600">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/patient" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-blue-600 mb-2">📅 All Appointments</h1>
        <p className="text-gray-600 mb-8">Showing all appointments for the next 3 months</p>

        {appointments.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <p className="text-gray-500 text-lg">No appointments scheduled in the next 3 months.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => (
              <div key={a.id} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">{a.provider}</h3>
                    <p className="text-gray-600 mt-2 text-lg">
                      📆 {new Date(a.date).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {a.repeat && a.repeat !== "none" && (
                      <p className="text-blue-600 mt-2 text-sm">
                        🔄 Repeats: {a.repeat}
                        {a.repeatEnd && ` until ${new Date(a.repeatEnd).toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.ceil((new Date(a.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}