import Link from "next/link"
import { Button } from "~/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"

export default function SimpleLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-32 h-32 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#ff8c42_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="relative z-10 text-center flex flex-col gap-6 max-w-xl mx-auto">
          {/* Logo and Title with animation */}
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-xl shadow-lg shadow-orange-200/80 transition-transform hover:scale-105 border border-orange-300/20">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-orange-950 tracking-tight">Pasar Rakyat</h1>
            </div>
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
                  SEKIP FTUI <span className="text-orange-500">x</span> GRADASI FTUI
                </span>
              </h2>
              <p className="text-orange-900/70 max-w-md mx-auto">
                Temukan berbagai pilihan makanan dan minuman dari kantin-kantin terbaik di kampus
              </p>
            </div>
          </div>

          {/* Main Action Button with hover effect */}
          <div className="animate-fade-in-up animation-delay-200">
            <Link href="/dashboard">
              <Button className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:via-orange-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-orange-400/20">
                Lihat Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Quick Stats with improved styling */}
          <div className="mt-12 animate-fade-in-up animation-delay-400">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-sm">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-white/80 to-orange-50/80 backdrop-blur-sm shadow-sm border border-orange-200/30 hover:border-orange-300/50 transition-all hover:shadow-md">
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-amber-600 text-3xl mb-1">
                  20+
                </div>
                <div className="text-orange-800">Kantin</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-white/80 to-orange-50/80 backdrop-blur-sm shadow-sm border border-orange-200/30 hover:border-orange-300/50 transition-all hover:shadow-md">
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-amber-600 text-3xl mb-1">
                  80+
                </div>
                <div className="text-orange-800">Menu Tersedia</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-white/80 to-orange-50/80 backdrop-blur-sm shadow-sm border border-orange-200/30 hover:border-orange-300/50 transition-all hover:shadow-md">
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-amber-600 text-3xl mb-1">
                  1.2k
                </div>
                <div className="text-orange-800">Transaksi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


