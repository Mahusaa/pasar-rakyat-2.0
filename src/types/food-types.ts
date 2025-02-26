export interface FoodItem {
  id: string
  name: string
  price: number
  image?: string
}

export interface FoodCounter {
  id: string
  name: string
  description: string
  image?: string
  stock: number
  items: FoodItem[]
}

export interface CartItem extends FoodItem {
  counterId: string
  quantity: number
}


