"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Patient {
  id: number;
  fullName: string;
  email: string;
  age: number;
  createdAt: string;
}

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

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  async function fetchPatientData() {
    try {
      setLoading(true);
      setError(null);

      const patientRes = await fetch(`/api/patients/${patientId}`);
      if (!patientRes.ok) throw new Error("Failed to fetch patient");
      const patientData = await patientRes.json();

      const appointmentsRes = await fetch(`/api/appointments?patientId=${patientId}`);
      const appointmentsData = await appointmentsRes.json();

      const prescriptionsRes = await fetch(`/api/prescriptions?patientId=${patientId}`);
      const prescriptionsData = await prescriptionsRes.json();

      setPatient(patientData);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData : []);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAppointment(id: number) {
    if (!confirm("Delete this appointment?")) return;
    try {
      const res = await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
      if (res.ok) setAppointments(appointments.filter((a) => a.id !== id));
    } catch (error) {
      alert("Failed to delete appointment");
    }
  }

  async function deletePrescription(id: number) {
    if (!confirm("Delete this prescription?")) return;
    try {
      const res = await fetch(`/api/prescriptions?id=${id}`, { method: "DELETE" });
      if (res.ok) setPrescriptions(prescriptions.filter((p) => p.id !== id));
    } catch (error) {
      alert("Failed to delete prescription");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading patient data...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error || "Patient not found"}
          </div>
          <Link href="/admin" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Patient List
        </Link>

        <div className="bg-white shadow-lg rounded-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">👤 {patient.fullName}</h1>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div><span className="font-semibold">Email:</span> {patient.email}</div>
            <div><span className="font-semibold">Age:</span> {patient.age || "N/A"}</div>
            <div><span className="font-semibold">Patient ID:</span> {patient.id}</div>
            <div><span className="font-semibold">Registered:</span> {new Date(patient.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 italic">No appointments scheduled.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Provider</th>
                  <th className="px-4 py-3 text-left">Date/Time</th>
                  <th className="px-4 py-3 text-left">Repeat</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{appt.provider}</td>
                    <td className="px-4 py-3">{new Date(appt.date).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {appt.repeat && appt.repeat !== "none" ? (
                        <span>{appt.repeat}{appt.repeatEnd && ` until ${new Date(appt.repeatEnd).toLocaleDateString()}`}</span>
                      ) : "One-time"}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteAppointment(appt.id)} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💊 Prescriptions</h2>
          {prescriptions.length === 0 ? (
            <p className="text-gray-500 italic">No prescriptions found.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Medication</th>
                  <th className="px-4 py-3 text-left">Dosage</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Refill Date</th>
                  <th className="px-4 py-3 text-left">Schedule</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((rx) => (
                  <tr key={rx.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{rx.medication}</td>
                    <td className="px-4 py-3">{rx.dosage}</td>
                    <td className="px-4 py-3">{rx.quantity}</td>
                    <td className="px-4 py-3">{new Date(rx.refillDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{rx.refillSchedule || "N/A"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deletePrescription(rx.id)} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}