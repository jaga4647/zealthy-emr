"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem("patient") || "null");
    if (!patient) {
      router.push("/");
      return;
    }

    async function fetchData() {
      try {
        const [apptRes, rxRes] = await Promise.all([
          fetch(`/api/appointments?patientId=${patient.id}`),
          fetch(`/api/prescriptions?patientId=${patient.id}`),
        ]);

        const [apptData, rxData] = await Promise.all([
          apptRes.json(),
          rxRes.json(),
        ]);

        setAppointments(apptData);
        setPrescriptions(rxData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading your data...</p>;

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        👩‍⚕️ Patient Portal
      </h1>

      {/* 🩺 Appointments Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h2 className="text-lg font-semibold mb-3">My Appointments</h2>
        {appointments.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {appointments.map((a, index) => (
              <li key={`${a.id}-${index}`}>
                {a.provider} — {new Date(a.date).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No appointments yet.</p>
        )}
      </section>

      {/* 💊 Prescriptions Section */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">My Prescriptions</h2>
        {prescriptions.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {prescriptions.map((rx, index) => (
              <li key={`${rx.id}-${index}`}>
                {rx.medication} — {rx.dosage} ({rx.quantity} qty)
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No prescriptions found.</p>
        )}
      </section>

      {/* 🌐 Navigation Buttons */}
      <div className="text-center mt-8 flex justify-center gap-4">
        <button
          onClick={() => router.push("/appointments")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          View All Appointments
        </button>
        <button
          onClick={() => router.push("/medications")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          View All Prescriptions
        </button>
      </div>
    </main>
  );
}
