import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ---- Allowed Medications ----
  const allowedMeds = [
    { name: "Amoxicillin", dosages: "250mg,500mg" },
    { name: "Ibuprofen", dosages: "200mg,400mg,600mg" },
    { name: "Paracetamol", dosages: "500mg,650mg" },
  ];

  for (const med of allowedMeds) {
    await prisma.allowedMedication.upsert({
      where: { name: med.name },
      update: {},
      create: med,
    });
  }

  // ---- Create demo patients ----
  const john = await prisma.patient.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      fullName: "John Doe",
      email: "john@example.com",
      password: "password123", // plain for demo
      age: 35,
    },
  });

  const jane = await prisma.patient.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      fullName: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      age: 29,
    },
  });

  // ---- Create appointments ----
  await prisma.appointment.createMany({
    data: [
      {
        patientId: john.id,
        provider: "Dr. Watson",
        date: new Date("2025-10-09T10:00:00Z"),
        repeat: "MONTHLY",
        repeatEnd: new Date("2026-01-09T10:00:00Z"),
      },
      {
        patientId: jane.id,
        provider: "Dr. Alice",
        date: new Date("2025-10-12T15:30:00Z"),
        repeat: "WEEKLY",
        repeatEnd: new Date("2025-12-12T15:30:00Z"),
      },
    ],
  });

  // ---- Create prescriptions ----
  await prisma.prescription.createMany({
    data: [
      {
        patientId: john.id,
        medication: "Amoxicillin",
        dosage: "500mg",
        quantity: 30,
        refillDate: new Date("2025-10-15T00:00:00Z"),
        refillSchedule: "Monthly",
      },
      {
        patientId: jane.id,
        medication: "Ibuprofen",
        dosage: "200mg",
        quantity: 20,
        refillDate: new Date("2025-10-20T00:00:00Z"),
        refillSchedule: "Weekly",
      },
    ],
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
