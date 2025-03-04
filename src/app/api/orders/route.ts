import { postOrder } from "~/server/db/queries";
import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { type CartItem } from "~/types/food-types";

interface OrderBody {
  paymentMethod: string;
  cashier: string;
  cartItems: CartItem[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;
    const { paymentMethod, cashier, cartItems } = body;

    if (!cartItems || !paymentMethod || !cashier) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await postOrder(cartItems, cashier, paymentMethod);
    revalidatePath("/logs")
    return NextResponse.json({ message: "Order created" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

