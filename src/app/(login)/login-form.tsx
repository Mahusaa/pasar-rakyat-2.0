'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Loader2, KeyIcon, AtSign } from 'lucide-react';
import type { ActionState } from '~/server/auth/middleware';
import { signIn } from './action';
import { ShoppingBag } from 'lucide-react';

export function Login() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signIn,
    { error: '' }
  )

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex">
      <div className="hidden lg:flex w-1/2 bg-orange-500 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-orange-500/90"></div>
          {/* Abstract Pattern */}
          <div className="absolute inset-0 opacity-10">
            {[
              { left: "10%", top: "15%", rotate: "30deg" },
              { left: "30%", top: "40%", rotate: "45deg" },
              { left: "50%", top: "25%", rotate: "60deg" },
              { left: "70%", top: "55%", rotate: "90deg" },
              { left: "20%", top: "75%", rotate: "120deg" },
              { left: "60%", top: "10%", rotate: "150deg" },
              { left: "80%", top: "30%", rotate: "180deg" },
              { left: "40%", top: "60%", rotate: "210deg" },
              { left: "15%", top: "50%", rotate: "240deg" },
              { left: "75%", top: "70%", rotate: "270deg" },
            ].map((pattern, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: pattern.left,
                  top: pattern.top,
                  transform: `rotate(${pattern.rotate})`,
                }}
              >
                <ShoppingBag className="w-24 h-24 text-white" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-white text-center p-8">
          <ShoppingBag className="w-16 h-16 mb-4 mx-auto" />
          <h1 className="text-3xl font-bold mb-4">Pasar Rakyat</h1>
          <p className="text-orange-100 max-w-md mx-auto">
            Cashier management system for campus canteens. Streamline your operations and manage orders efficiently.
          </p>
        </div>
      </div>



      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-orange-500 text-white p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-orange-950">Pasar Rakyat</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-orange-950">Cashier Login</h2>
              <p className="text-gray-500 text-sm">Sign in to access your cashier dashboard</p>
            </div>

            <form className="space-y-4" action={formAction}>
              <div className="space-y-2">
                <Label
                  className="mb-3 mt-5 block text-xs font-medium text-primary"
                  htmlFor="email"
                >
                  Email
                </Label>
                <div className="relative">
                  <Input
                    className="peer block w-full  border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    required
                  />
                  <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  className="mb-3 mt-5 block text-xs font-medium text-primary"
                  htmlFor="password"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    className="peer block w-full  border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    minLength={6}
                  />
                  <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-primary" />
                </div>


              </div>
              {state?.error && (
                <div className="text-red-500 text-sm items-center">{state.error}</div>
              )}

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11"
                disabled={pending}
                type='submit'
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Loading...
                  </>
                ) : "Sign In to Dashboard"}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <Link href="/" className="text-sm text-orange-600 hover:text-orange-700">
                Back?
              </Link>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span>Need help?</span>
                  <a href="#" className="text-orange-600 hover:text-orange-700">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
