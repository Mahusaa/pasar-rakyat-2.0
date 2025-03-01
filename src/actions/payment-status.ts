'use server'

import { logs } from '~/server/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '~/server/db'


export interface ActionResponse {
  success: boolean;
  message: string;
}

export async function updatePaymentStatus(prevState: ActionResponse | null, id: number): Promise<ActionResponse> {
  try {
    await db.update(logs)
      .set({ status: 'completed' })
      .where(eq(logs.id, id))

    revalidatePath('/logs')
    return { success: true, message: `Sucessfully update id: ${id}` }
  } catch (error) {
    console.error('Failed to update payment status:', error)
    return { success: false, message: `Failed update id: ${id}` }
  }
}
