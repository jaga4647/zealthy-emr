import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;
  
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(id) },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("GET /api/patients/[id] failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}