import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: Number(params.id) },
    });

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    return NextResponse.json(prescription);
  } catch (error) {
    console.error("GET /api/prescriptions/[id] failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const id = Number(params.id);

    const updated = await prisma.prescription.update({
      where: { id },
      data: {
        medication: data.medication,
        dosage: data.dosage,
        quantity: Number(data.quantity),
        refillDate: new Date(data.refillDate),
        refillSchedule: data.refillSchedule || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/prescriptions/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update prescription" }, { status: 500 });
  }
}