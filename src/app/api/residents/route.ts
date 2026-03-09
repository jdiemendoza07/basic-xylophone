import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const gender = searchParams.get('gender');
  const purok = searchParams.get('purok');
  const voterStatus = searchParams.get('voterStatus');
  const birthPlace = searchParams.get('birthPlace');
  const religion = searchParams.get('religion');
  const educationalAttainment = searchParams.get('educationalAttainment');
  const occupation = searchParams.get('occupation');
  const residencyStatus = searchParams.get('residencyStatus');
  const sector = searchParams.get('sector');
  const governmentAssistance = searchParams.get('governmentAssistance');
  const ageMin = searchParams.get('ageMin');
  const ageMax = searchParams.get('ageMax');

  const now = new Date();
  const dateMax = ageMin ? new Date(now.getFullYear() - parseInt(ageMin), now.getMonth(), now.getDate()) : undefined;
  const dateMin = ageMax ? new Date(now.getFullYear() - parseInt(ageMax) - 1, now.getMonth(), now.getDate() + 1) : undefined;

  const where = {
    AND: [
      q
        ? {
            OR: [
              { firstName: { contains: q } },
              { lastName: { contains: q } },
            ],
          }
        : {},
      gender ? { gender } : {},
      purok ? { purok } : {},
      voterStatus ? { voterStatus } : {},
      birthPlace ? { birthPlace: { contains: birthPlace } } : {},
      religion ? { religion: { contains: religion } } : {},
      educationalAttainment ? { educationalAttainment: { contains: educationalAttainment } } : {},
      occupation ? { occupation: { contains: occupation } } : {},
      residencyStatus ? { residencyStatus } : {},
      sector ? { sector: { contains: sector } } : {},
      governmentAssistance ? { governmentAssistance: { contains: governmentAssistance } } : {},
      dateMin || dateMax ? {
        birthDate: {
          ...(dateMin ? { gte: dateMin } : {}),
          ...(dateMax ? { lte: dateMax } : {}),
        }
      } : {}
    ],
  };

  try {
    const residents = await prisma.resident.findMany({
      where,
      orderBy: { lastName: "asc" }
    });
    return NextResponse.json(residents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch residents" }, { status: 500 });
  }
}
