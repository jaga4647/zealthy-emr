import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all prescriptions
export async function GET() {
  try {
    const data = await prisma.prescription.findMany({
      include: { patient: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}

// POST create new prescription
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { patientId, medication, dosage, quantity, refillDate, refillSchedule } = body;

    const data = await prisma.prescription.create({
      data: {
        patientId: Number(patientId),
        medication,
        dosage,
        quantity: Number(quantity),
        refillDate: new Date(refillDate),
        refillSchedule,
      },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error creating prescription:", err);
    return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
  }
}

// DELETE prescription
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    await prisma.prescription.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete prescription" }, { status: 500 });
  }
}
