import TransactionLog from "~/components/transaction-log";
import { getOrders } from "~/server/db/queries";

export default async function Page() {
  const orders = await getOrders()
  return (
    <TransactionLog orders={orders} />
  )

}
