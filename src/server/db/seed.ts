import { users } from './schema';
import { db } from '.';
import { hashPassword } from '../auth/session';
import { env } from '~/env';


async function seed() {
  const ownerEmail = 'superadmin@gmail.com';
  const ownerPassword = env.ADMIN_PASS;
  const ownerPasswordHash = await hashPassword(ownerPassword);

  await db
    .insert(users)
    .values([
      {
        name: 'Super Admin',
        email: ownerEmail,
        passwordHash: ownerPasswordHash,
        role: 'owner',
      },
    ])
    .returning();

  console.log('Initial users created.');
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });

