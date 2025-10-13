"use client";
import { useEffect, useState } from "react";

export default function MedicationsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem("patient") || "null");
    if (!patient) {
      window.location.href = "/";
    } else {
      fetch(`/api/prescriptions?patientId=${patient.id}`)
        .then((res) => res.json())
        .then((data) => setPrescriptions(data))
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading prescriptions...
      </p>
    );

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6 flex items-center justify-center gap-2">
          💊 My Prescriptions
        </h1>

        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          {prescriptions.length > 0 ? (
            <ul className="list-none divide-y divide-gray-200">
              {prescriptions.map((rx, index) => (
                <li key={`${rx.id}-${index}`} className="py-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="font-semibold text-gray-800">
                      {rx.medication}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {rx.dosage} — {rx.quantity} qty
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-6">
              No prescriptions found.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
