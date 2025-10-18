import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 🩺 Get all patients
export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(patients || []);
  } catch (error) {
    console.error("GET /patients failed:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// ➕ Add new patient
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.fullName || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({ data });
    return NextResponse.json(patient);
  } catch (error: any) {
    console.error("POST /patients failed:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}

// ❌ Delete patient
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await prisma.patient.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /patients failed:", error);
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );
  }
}