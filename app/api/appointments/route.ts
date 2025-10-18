import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET appointments (supports both patientId and email)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const email = searchParams.get("email");

    // 🎯 If email is provided → fetch appointments via patient relation
    if (email) {
      const patient = await prisma.patient.findUnique({
        where: { email },
        include: { appointments: true },
      });

      if (!patient) {
        console.warn(`No patient found for email: ${email}`);
        return NextResponse.json([], { status: 200 });
      }

      // ✅ Return only this patient's appointments
      return NextResponse.json(patient.appointments ?? []);
    }

    // 🎯 If patientId is provided → fetch directly by ID
    if (patientId) {
      const appointments = await prisma.appointment.findMany({
        where: { patientId: Number(patientId) },
        orderBy: { date: "asc" },
      });
      return NextResponse.json(appointments);
    }

    // 🧠 Default (admin view → all appointments)
    const allAppointments = await prisma.appointment.findMany({
      include: { patient: true },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(allAppointments);
  } catch (error) {
    console.error("GET /appointments failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ➕ POST create appointment
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, provider, date, repeat } = body;

    if (!patientId || !provider || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        patientId: Number(patientId),
        provider,
        date: new Date(date),
        repeat: repeat || "none",
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("POST /appointments failed:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

// ❌ DELETE appointment
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "Missing appointment ID" }, { status: 400 });
    }

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /appointments failed:", error);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
