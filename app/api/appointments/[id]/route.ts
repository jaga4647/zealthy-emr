import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const id = Number(params.id);

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        provider: data.provider,
        date: new Date(data.date),
        repeat: data.repeat || "none",
        repeatEnd: data.repeatEnd ? new Date(data.repeatEnd) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/appointments/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}