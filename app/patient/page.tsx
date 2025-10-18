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

interface Prescription {
  id: number;
  medication: string;
  dosage: string;
  quantity: number;
  refillDate: string;
  refillSchedule?: string;
}

interface Patient {
  email: string;
  fullName?: string;
}

export default function PatientPortal() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const stored = localStorage.getItem("patient");
    const patient: Patient | null = stored ? JSON.parse(stored) : null;

    if (!patient || !patient.email) {
      console.warn("⚠️ No patient found in localStorage — redirecting to login");
      router.push("/");
      return;
    }

    async function fetchData() {
      if (!patient || !patient.email) {
        console.error("Patient data is missing");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [apptRes, rxRes] = await Promise.all([
          fetch(`/api/appointments?email=${encodeURIComponent(patient.email)}`),
          fetch(`/api/prescriptions?email=${encodeURIComponent(patient.email)}`)
        ]);

        if (!apptRes.ok || !rxRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const apptData = await apptRes.json();
        const rxData = await rxRes.json();

        if (!Array.isArray(apptData)) {
          setAppointments([]);
        } else {
          setAppointments(apptData);
        }

        if (!Array.isArray(rxData)) {
          setPrescriptions([]);
        } else {
          setPrescriptions(rxData);
        }
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, mounted]);

  function filterNext7Days<T extends { date?: string; refillDate?: string }>(items: T[]): T[] {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return items.filter((item) => {
      const dateStr = item.date || item.refillDate;
      if (!dateStr) return false;
      
      const itemDate = new Date(dateStr);
      return itemDate >= now && itemDate <= sevenDaysFromNow;
    });
  }

  const upcomingAppointments = filterNext7Days(appointments);
  const upcomingRefills = filterNext7Days(prescriptions);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-2xl mb-2">👩‍⚕️</div>
          <div className="text-gray-600">Loading your information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-center text-4xl font-bold text-blue-600 mb-2">
          👩‍⚕️ Patient Portal
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Showing appointments and refills in the next 7 days
        </p>

        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              📅 Upcoming Appointments (Next 7 Days)
            </h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {upcomingAppointments.length}
            </span>
          </div>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 italic">No appointments in the next 7 days.</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((a) => (
                <div
                  key={a.id}
                  className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg hover:bg-blue-100 transition"
                >
                  <div className="font-semibold text-lg text-gray-800">
                    {a.provider}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    📆 {new Date(a.date).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {a.repeat && a.repeat !== "none" && (
                    <div className="text-xs text-blue-600 mt-1">
                      🔄 Repeats: {a.repeat}
                      {a.repeatEnd && ` until ${new Date(a.repeatEnd).toLocaleDateString()}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              💊 Upcoming Refills (Next 7 Days)
            </h2>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              {upcomingRefills.length}
            </span>
          </div>
          {upcomingRefills.length === 0 ? (
            <p className="text-gray-500 italic">No refills due in the next 7 days.</p>
          ) : (
            <div className="space-y-3">
              {upcomingRefills.map((p) => (
                <div
                  key={p.id}
                  className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg hover:bg-purple-100 transition"
                >
                  <div className="font-semibold text-lg text-gray-800">
                    {p.medication}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div className="text-gray-700">
                      <span className="font-medium">Dosage:</span> {p.dosage}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Quantity:</span> {p.quantity}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Refill Date:</span>{" "}
                      {new Date(p.refillDate).toLocaleDateString()}
                    </div>
                    {p.refillSchedule && (
                      <div className="text-gray-700">
                        <span className="font-medium">Schedule:</span> {p.refillSchedule}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 View Full Schedule</h2>
          <div className="flex gap-4">
            <Link
              href="/appointments"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-blue-700 transition"
            >
              All Appointments (3 months)
            </Link>
            <Link
              href="/prescriptions"
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-purple-700 transition"
            >
              All Prescriptions (3 months)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}