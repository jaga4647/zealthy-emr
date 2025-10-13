"use client";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

export default function AdminPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Safe JSON parser — avoids crashes even if API returns invalid JSON
  async function loadData() {
    const safeJson = async (res: Response) => {
      try {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    };

    try {
      const [p1, a1, r1] = await Promise.all([
        fetch("/api/patients").then(safeJson),
        fetch("/api/appointments").then(safeJson),
        fetch("/api/prescriptions").then(safeJson),
      ]);

      setPatients(p1);
      setAppointments(a1);
      setPrescriptions(r1);
    } catch (err) {
      console.error("❌ loadData failed:", err);
      toast.error("Failed to load data");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Reusable safe fetch wrapper
  async function safeFetch(url: string, options: any, successMsg: string) {
    try {
      const res = await fetch(url, options);

      if (res.ok) {
        toast.success(successMsg);
        await loadData();
        return;
      }

      let message = `Request failed (${res.status})`;
      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {
        // ignore bad JSON
      }

      throw new Error(message);
    } catch (err: any) {
      console.error("❌ Fetch error:", err);
      toast.error(err.message || "Something went wrong");
    }
  }

  // ✅ CRUD operations
  async function addPatient(fd: FormData) {
    const newPatient = {
      fullName: fd.get("fullName"),
      email: fd.get("email"),
      password: fd.get("password"),
      age: Number(fd.get("age")),
    };

    await safeFetch(
      "/api/patients",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      },
      "✅ Patient added successfully"
    );
  }

  async function addAppointment(fd: FormData) {
    const newAppt = {
      patientId: fd.get("patientId"),
      provider: fd.get("provider"),
      date: fd.get("date"),
    };

    await safeFetch(
      "/api/appointments",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppt),
      },
      "✅ Appointment created successfully"
    );
  }

  async function addPrescription(fd: FormData) {
    const newRx = {
      patientId: fd.get("patientId"),
      medication: fd.get("medication"),
      dosage: fd.get("dosage"),
      quantity: Number(fd.get("quantity")),
      refillDate: fd.get("refillDate"),
      refillSchedule: fd.get("refillSchedule"),
    };

    await safeFetch(
      "/api/prescriptions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRx),
      },
      "✅ Prescription added successfully"
    );
  }

  async function del(url: string, id: number) {
    if (!confirm("Are you sure you want to delete this record?")) return;
    await safeFetch(`${url}?id=${id}`, { method: "DELETE" }, "🗑️ Deleted successfully");
  }

  // ✅ Form handlers
  const handleAddPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);

    try {
      await addPatient(fd);
      form.reset();
    } catch (err) {
      console.error("Add patient failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);

    try {
      await addAppointment(fd);
      form.reset();
    } catch (err) {
      console.error("Add appointment failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);

    try {
      await addPrescription(fd);
      form.reset();
    } catch (err) {
      console.error("Add prescription failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI Render
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8 space-y-12 text-gray-800">
      <Toaster position="top-right" richColors />
      <h1 className="text-3xl font-bold text-center mb-10 tracking-wide text-blue-700">
        🩺 Mini EMR Admin Panel
      </h1>

      {/* ---- Patient Section ---- */}
      <section className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Add New Patient</h2>
        <form onSubmit={handleAddPatient} className="grid grid-cols-2 gap-4">
          <input name="fullName" placeholder="Full Name" className="border p-3 rounded-lg" required />
          <input name="email" placeholder="Email" className="border p-3 rounded-lg" required />
          <input
            name="password"
            placeholder="Password"
            type="password"
            className="border p-3 rounded-lg"
            required
          />
          <input name="age" placeholder="Age" type="number" className="border p-3 rounded-lg" required />
          <button
            type="submit"
            disabled={loading}
            className={`col-span-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Add Patient"}
          </button>
        </form>

        <table className="w-full mt-6 border text-sm rounded-lg overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Age</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(patients) &&
              patients.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{p.fullName}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3 text-center">{p.age}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => del("/api/patients", p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      {/* ---- Appointment Section ---- */}
      <section className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Add Appointment</h2>
        <form onSubmit={handleAddAppointment} className="grid grid-cols-3 gap-4">
          <select name="patientId" className="border p-3 rounded-lg" required>
            <option value="">Select Patient</option>
            {Array.isArray(patients) &&
              patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
          </select>
          <input name="provider" placeholder="Provider" className="border p-3 rounded-lg" required />
          <input name="date" type="datetime-local" className="border p-3 rounded-lg" required />
          <button
            type="submit"
            disabled={loading}
            className={`col-span-3 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Add Appointment"}
          </button>
        </form>

        <table className="w-full mt-6 border text-sm rounded-lg overflow-hidden">
          <thead className="bg-green-50">
            <tr>
              <th className="p-3">Patient</th>
              <th className="p-3">Provider</th>
              <th className="p-3">Date/Time</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(appointments) &&
              appointments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{a.patient?.fullName}</td>
                  <td className="p-3">{a.provider}</td>
                  <td className="p-3">{new Date(a.date).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => del("/api/appointments", a.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      {/* ---- Prescription Section ---- */}
      <section className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-3">Add Prescription</h2>
        <form onSubmit={handleAddPrescription} className="grid grid-cols-3 gap-4">
          <select name="patientId" className="border p-3 rounded-lg" required>
            <option value="">Select Patient</option>
            {Array.isArray(patients) &&
              patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
          </select>

          <input name="medication" placeholder="Medication" className="border p-3 rounded-lg" required />
          <input name="dosage" placeholder="Dosage" className="border p-3 rounded-lg" required />
          <input name="quantity" type="number" placeholder="Quantity" className="border p-3 rounded-lg" required />
          <input name="refillDate" type="date" className="border p-3 rounded-lg" required />
          <input name="refillSchedule" placeholder="Refill Schedule" className="border p-3 rounded-lg" />

          <button
            type="submit"
            disabled={loading}
            className={`col-span-3 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Add Prescription"}
          </button>
        </form>

        <table className="w-full mt-6 border text-sm rounded-lg overflow-hidden">
          <thead className="bg-purple-50">
            <tr>
              <th className="p-3">Patient</th>
              <th className="p-3">Medication</th>
              <th className="p-3">Dosage</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Refill Date</th>
              <th className="p-3">Refill Schedule</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(prescriptions) && prescriptions.length > 0 ? (
              prescriptions.map((rx) => (
                <tr key={rx.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{rx.patient?.fullName || "—"}</td>
                  <td className="p-3">{rx.medication}</td>
                  <td className="p-3">{rx.dosage}</td>
                  <td className="p-3 text-center">{rx.quantity}</td>
                  <td className="p-3">
                    {rx.refillDate ? new Date(rx.refillDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-3">{rx.refillSchedule || "—"}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => del("/api/prescriptions", rx.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No prescriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
