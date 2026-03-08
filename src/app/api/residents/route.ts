import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const resident = await prisma.resident.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate),
      },
    });
    return NextResponse.json(resident);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create resident" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const residents = await prisma.resident.findMany({
      orderBy: { lastName: "asc" }
    });
    return NextResponse.json(residents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch residents" }, { status: 500 });
  }
}
