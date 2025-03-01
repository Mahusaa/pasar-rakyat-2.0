import { postOrder } from "~/server/db/queries";
import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

interface OrderBody {
  amount: number;
  paymentMethod: string;
  cashier: string;
  menu: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;
    const { amount, paymentMethod, cashier, menu } = body;

    if (!amount || !paymentMethod || !cashier) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await postOrder(amount, paymentMethod, cashier, menu);
    revalidatePath("/logs")
    return NextResponse.json({ message: "Order created" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

