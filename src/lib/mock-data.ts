
import type { FoodCounter } from "~/types/food-types"


export const foodCounters: FoodCounter[] = [
  {
    id: "1",
    name: "Mas Andi",
    description: "Specialist in Mie Yamin and Bakso",
    stock: 100,
    items: [
      { id: "1-1", name: "Mie Yamin Biasa", price: 16000 },
      { id: "1-2", name: "Mie Yamin Komplit", price: 18000 },
      { id: "1-3", name: "Bakso Malang", price: 16000 },
    ],
  },
  {
    id: "2",
    name: "Mbak Nita",
    description: "Pecel Ayam with crispy toppings",
    stock: 80,
    items: [
      { id: "2-1", name: "Pecel Ayam", price: 22000 },
      { id: "2-2", name: "Pecel Ayam + Tahu/Tempe", price: 24000 },
    ],
  },
  {
    id: "3",
    name: "Mbak Sri",
    description: "Ketoprak with a variety of toppings",
    stock: 90,
    items: [
      { id: "3-1", name: "Ketoprak", price: 13000 },
      { id: "3-2", name: "Ketoprak Keju", price: 18000 },
      { id: "3-3", name: "Ketoprak Telur", price: 16000 },
      { id: "3-4", name: "Ketoprak Keju + Telur", price: 20000 },
    ],
  },
  {
    id: "4",
    name: "Mas Heru",
    description: "Soto with various meat choices",
    stock: 70,
    items: [
      { id: "4-1", name: "Soto Daging + Nasi", price: 19000 },
      { id: "4-2", name: "Soto Mie + Nasi", price: 17000 },
      { id: "4-3", name: "Soto Babat + Nasi", price: 17000 },
      { id: "4-4", name: "Soto Campur (Daging + Babat) + Nasi", price: 20000 },
    ],
  },
  {
    id: "5",
    name: "Mas Warto",
    description: "Various fried and noodle dishes",
    stock: 120,
    items: [
      { id: "5-1", name: "Mie Goreng/Rebus Ayam", price: 15000 },
      { id: "5-2", name: "Mie Goreng/Rebus Bakso", price: 15000 },
      { id: "5-3", name: "Mie Goreng/Rebus Sosis", price: 15000 },
      { id: "5-4", name: "Mie Goreng/Rebus Ati Ampela", price: 17000 },
      { id: "5-5", name: "Nasi Goreng Ayam", price: 15000 },
      { id: "5-6", name: "Nasi Goreng Spesial", price: 17000 },
    ],
  },
  {
    id: "6",
    name: "Bu Wati",
    description: "Authentic Javanese Tongseng and Sop",
    stock: 60,
    items: [
      { id: "6-1", name: "Tongseng Gulai Daging", price: 19000 },
      { id: "6-2", name: "Tongseng Gulai Ayam", price: 17000 },
      { id: "6-3", name: "Sop Daging", price: 18000 },
      { id: "6-4", name: "Sop Ayam", price: 16000 },
    ],
  },
  {
    id: "7",
    name: "Pak Ansor",
    description: "Somay and Batagor specialist",
    stock: 50,
    items: [
      { id: "7-1", name: "Somay", price: 10000 },
      { id: "7-2", name: "Batagor", price: 10000 },
    ],
  },
  {
    id: "8",
    name: "Bang Udi",
    description: "Grilled Sate with special sauce",
    stock: 75,
    items: [
      { id: "8-1", name: "Sate Ayam", price: 18000 },
      { id: "8-2", name: "Sate Ayam Full Daging", price: 20000 },
      { id: "8-3", name: "Sate Ayam Full Daging + Nasi/Lontong", price: 23000 },
    ],
  },
  {
    id: "9",
    name: "Mas Ibnu",
    description: "Spicy Nasi Gila specialties",
    stock: 40,
    items: [
      { id: "9-1", name: "Nasi Gila", price: 15000 },
      { id: "9-2", name: "Nasi Gila Keju", price: 18000 },
    ],
  },
];


