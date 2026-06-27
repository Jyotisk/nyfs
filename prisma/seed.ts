import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Creates (or updates the password of) an admin login account.
// Override the defaults with env vars:
//   ADMIN_SEED_EMAIL=you@example.com ADMIN_SEED_PASSWORD=secret npx prisma db seed
async function main() {
  const email = (process.env.ADMIN_SEED_EMAIL ?? 'admin@gmail.com').trim().toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD ?? 'Admin@1234#';

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`✔ Seeded admin user: ${email}`);
  console.log('  Make sure this email is also listed in ADMIN_EMAILS.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
