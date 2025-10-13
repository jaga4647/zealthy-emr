"use client";
import { useEffect, useState } from "react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem("patient") || "null");
    if (!patient) {
      window.location.href = "/";
    } else {
      fetch(`/api/appointments?patientId=${patient.id}`)
        .then((res) => res.json())
        .then((data) => {
          // Sort by date ascending (nearest first)
          const sorted = data.sort(
            (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setAppointments(sorted.slice(0, 5)); // Show only next 5 upcoming
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">Loading your appointments...</p>
    );

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6 flex items-center justify-center gap-2">
          📅 Upcoming Appointments
        </h1>

        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          {appointments.length > 0 ? (
            <ul className="list-none divide-y divide-gray-200">
              {appointments.map((a, index) => (
                <li key={`${a.id}-${index}`} className="py-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="font-semibold text-gray-800">
                      {a.provider}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {new Date(a.date).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-6">
              No upcoming appointments scheduled.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
