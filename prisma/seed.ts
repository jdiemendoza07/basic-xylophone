import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10);

  await prisma.user.upsert({
    where: { username: "admin@example.com" },
    update: {},
    create: {
      username: "admin@example.com",
      password: hashedPassword,
      name: "System Administrator",
      role: "ADMIN",
    },
  });

  console.log("Database seeded successfully with admin user.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
