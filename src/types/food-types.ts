export interface FoodItem {
  id: string
  name: string
  price: number
  image?: string
  counterId: string
  disabled: boolean;
}

export interface FoodCounter {
  id: string
  name: string
  description: string
  image?: string
  stock: number
  items: FoodItem[]
  disabled: boolean;
}

export interface CartItem extends FoodItem {
  counterId: string;
  quantity: number
}


