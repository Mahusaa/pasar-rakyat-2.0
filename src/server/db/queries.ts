import { and, eq, isNull } from 'drizzle-orm';
import { db } from '.';
import { cookies } from 'next/headers';
import { logs, users } from './schema';
import { verifyToken } from '../auth/session';


export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie?.value) {
    return null;
  }
  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData?.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }
  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }
  return user[0];
}

export async function postOrder(amount: number, paymentMethod: string, cashier: string, menu: string[]) {
  const status = paymentMethod !== "cash" ? "pending" : "completed"
  await db.insert(logs).values({
    cashier,
    paymentMethod,
    menu,
    amount: String(amount),
    status,
    time: new Date(),
  });
}

export async function getOrders() {
  const order = await db.query.logs.findMany({
    orderBy: (logs, { desc }) => [desc(logs.time)]
  })
  return order
}


