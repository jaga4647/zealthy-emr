import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔁 Helper to expand recurring appointments for the next 3 months
function generateRecurringAppointments(appointment: any) {
  const occurrences = [];
  const startDate = new Date(appointment.date);
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3); // 3 months ahead

  let nextDate = new Date(startDate);

  const step =
    appointment.repeat?.toLowerCase() === "daily"
      ? 1
      : appointment.repeat?.toLowerCase() === "weekly"
      ? 7
      : appointment.repeat?.toLowerCase() === "monthly"
      ? 30
      : 0;

  if (step === 0) {
    occurrences.push(appointment);
    return occurrences;
  }

  while (nextDate <= endDate) {
    occurrences.push({
      ...appointment,
      date: new Date(nextDate),
    });
    nextDate.setDate(nextDate.getDate() + step);
  }

  return occurrences;
}

// 📅 GET all appointments (expanded for recurrence)
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true },
    });

    // Expand recurring appointments
    const expanded = appointments.flatMap(generateRecurringAppointments);

    return NextResponse.json(expanded || []);
  } catch (error) {
    console.error("GET /appointments failed:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// ➕ POST: create new appointment
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { patientId, provider, date, repeat } = data;

    if (!patientId || !provider || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: Number(patientId),
        provider,
        date: parsedDate,
        repeat: repeat || "none",
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("POST /appointments failed:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

// ❌ DELETE: remove appointment
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /appointments failed:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
