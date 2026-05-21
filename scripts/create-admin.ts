import { prisma } from "../lib/cms/db";
import { hashPassword } from "../lib/cms/auth/password";

// Usage: npm run admin:create -- "email@example.com" "Full Name" "password"
async function main() {
  const [, , email, name, password] = process.argv;
  if (!email || !name || !password) {
    console.error('Usage: npm run admin:create -- "email@example.com" "Full Name" "password"');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, name, passwordHash },
  });

  console.log(`Admin ready: ${email}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
