import { and, eq, isNull } from 'drizzle-orm';
import { db } from '.';
import { cookies } from 'next/headers';
import { logs, users } from './schema';
import { verifyToken } from '../auth/session';
import { type CartItem } from '~/types/food-types';


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

export async function postOrder(cartItems: CartItem[], cashier: string, paymentMethod: string) {
  const status = paymentMethod !== "cash" ? "pending" : "completed"
  if (cartItems.length === 0) return;

  const logData = cartItems.map((item) => ({
    counterId: String(item.id).split("-")[0] ?? "",
    food: item.name,
    cashier,
    paymentMethod,
    quantity: item.quantity,
    amount: item.price * item.quantity,
    status,
    time: new Date(),
  }));

  await db.insert(logs).values(logData);
}

export async function getOrders() {
  const order = await db.query.logs.findMany({
    orderBy: (logs, { desc }) => [desc(logs.time)]
  })
  return order
}


