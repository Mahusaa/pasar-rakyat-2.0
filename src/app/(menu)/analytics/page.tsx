import { TransactionHeatmap } from "~/components/transaction-heatmap"
import { getOrdersDefault } from "~/server/db/queries"

export default async function Page() {
  const data = await getOrdersDefault()
  return (
    <TransactionHeatmap data={data} />
  )

}

