"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Prescription {
  id: number;
  medication: string;
  dosage: string;
  quantity: number;
  refillDate: string;
  refillSchedule?: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("patient");
    const patient = stored ? JSON.parse(stored) : null;

    if (!patient || !patient.email) {
      router.push("/");
      return;
    }

    async function fetchPrescriptions() {
      try {
        const res = await fetch(`/api/prescriptions?email=${encodeURIComponent(patient.email)}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // Filter for next 3 months
          const now = new Date();
          const threeMonthsFromNow = new Date();
          threeMonthsFromNow.setMonth(now.getMonth() + 3);
          
          const filtered = data.filter((p: Prescription) => {
            const refillDate = new Date(p.refillDate);
            return refillDate >= now && refillDate <= threeMonthsFromNow;
          });
          
          // Sort by refill date (nearest first)
          filtered.sort((a, b) => new Date(a.refillDate).getTime() - new Date(b.refillDate).getTime());
          
          setPrescriptions(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrescriptions();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-600">Loading prescriptions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/patient" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-purple-600 mb-2">💊 All Prescriptions</h1>
        <p className="text-gray-600 mb-8">Showing all prescriptions for the next 3 months</p>

        {prescriptions.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <p className="text-gray-500 text-lg">No prescriptions scheduled in the next 3 months.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((p) => (
              <div key={p.id} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">{p.medication}</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600 font-medium">Dosage:</span>
                        <p className="text-gray-800 text-lg">{p.dosage}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Quantity:</span>
                        <p className="text-gray-800 text-lg">{p.quantity}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Refill Date:</span>
                        <p className="text-gray-800 text-lg">
                          {new Date(p.refillDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      {p.refillSchedule && (
                        <div>
                          <span className="text-gray-600 font-medium">Schedule:</span>
                          <p className="text-gray-800 text-lg">{p.refillSchedule}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.ceil((new Date(p.refillDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
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