import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET prescriptions (supports both patientId and email)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const email = searchParams.get("email");

    // 🎯 If email is provided → fetch prescriptions via patient relation
    if (email) {
      const patient = await prisma.patient.findUnique({
        where: { email },
        include: { prescriptions: true },
      });

      if (!patient) {
        console.warn(`No patient found for email: ${email}`);
        return NextResponse.json([], { status: 200 });
      }

      console.log(`✅ Found ${patient.prescriptions?.length || 0} prescriptions for ${email}`);
      
      // ✅ Return only this patient's prescriptions
      return NextResponse.json(patient.prescriptions ?? [], { status: 200 });
    }

    // 🎯 If patientId is provided → fetch directly by ID
    if (patientId) {
      const prescriptions = await prisma.prescription.findMany({
        where: { patientId: Number(patientId) },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(prescriptions, { status: 200 });
    }

    // 🧠 Default (admin view → all prescriptions)
    const allPrescriptions = await prisma.prescription.findMany({
      include: { patient: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(allPrescriptions, { status: 200 });
  } catch (error) {
    console.error("GET /prescriptions failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ➕ POST create prescription
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, medication, dosage, quantity, refillDate, refillSchedule } = body;

    if (!patientId || !medication || !dosage || !quantity || !refillDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPrescription = await prisma.prescription.create({
      data: {
        patientId: Number(patientId),
        medication,
        dosage,
        quantity: Number(quantity),
        refillDate: new Date(refillDate),
        refillSchedule: refillSchedule || null,
      },
    });

    return NextResponse.json(newPrescription, { status: 201 });
  } catch (error) {
    console.error("POST /prescriptions failed:", error);
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 });
  }
}

// ❌ DELETE prescription
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "Missing prescription ID" }, { status: 400 });
    }

    await prisma.prescription.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /prescriptions failed:", error);
    return NextResponse.json({ error: "Failed to delete prescription" }, { status: 500 });
  }
}