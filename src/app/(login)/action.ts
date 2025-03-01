'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { users } from '~/server/db/schema';
import { db } from '~/server/db';
import { comparePasswords, setSession } from '~/server/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { validatedAction } from '~/server/auth/middleware';


const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  })


  if (!user) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password,
    };
  }


  const isPasswordValid = await comparePasswords(
    password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password,
    };
  }

  await Promise.all([
    setSession(user),
  ])


  redirect('/dashboard');
});


export async function signOut() {
  (await cookies()).delete('session');
}


