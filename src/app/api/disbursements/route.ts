import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const disbursement = await prisma.disbursementCheck.create({
      data: {
        ...data,
      },
    });
    return NextResponse.json(disbursement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create disbursement" }, { status: 500 });
  }
}
