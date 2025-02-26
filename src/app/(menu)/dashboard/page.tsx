import FoodDashboard from "~/components/food-dashboard";
import { CartProvider } from "~/lib/cart-context";

export default function Page() {
  return (
    <CartProvider>
      <FoodDashboard />
    </CartProvider>
  )
}

