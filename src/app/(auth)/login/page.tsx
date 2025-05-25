'use client'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { loginAction } from '../../../../actions/auth-actions'
import Image from 'next/image'
import Link from 'next/link'
import { Public } from '@prisma/client/runtime/library'
import PublicHeader from '@/components/layout/publicHeader'

type FormValues = {
  email: string
  password: string
}

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    startTransition(async () => {
      const res = await loginAction(data.email, data.password)

      if (res.error) {
        setError(res.error)
      } else {
        setError(null)
        router.push("/redirect")
      }
    })
  })

  return (
    <div>
      <PublicHeader />
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">

        <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex">
          {/* Lado izquierdo con imagen */}
          <div className="hidden md:block w-1/2 relative p-6">
            <Image
              src="/img/welcome.svg"
              width={400}
              height={400}
              alt="login illustration"
              className="object-contain mx-auto"
              priority
            />
          </div>
          <div className="hidden md:block w-[2px] border rounded-2xl h-auto self-stretch border-gray-200 bg-gray-200 my-6"></div>        {/* Lado derecho con formulario */}
          <div className="w-full md:w-1/2 py-8 px-8">
            <div className="w-full max-w-md mx-auto">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <Image
                  src="/img/miau.jpg"
                  width={50}
                  height={50}
                  alt='logo'
                  className="rounded-full"
                />
              </div>

              {/* Título y subtítulo */}
              <h1 className="text-2xl font-bold text-center mb-2">Bienvenido!</h1>
              <p className="text-gray-500 text-center mb-8">Ingresa para encontrar el servicio que estas buscando</p>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
                  {error}
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image src="/icons/user.svg" alt='user-img' height={20} width={20} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Ingresa tu email"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      {...register("email", {
                        required: {
                          value: true,
                          message: "El correo es requerido"
                        }
                      })}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Contraseña
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image
                        src="/icons/lock-password.svg"
                        alt='user-img'
                        height={20}
                        width={20}
                      />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      {...register("password", {
                        required: {
                          value: true,
                          message: "La contraseña es requerida"
                        }
                      })}
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Image
                          src="/icons/eye-off.svg"
                          alt='user-img'
                          height={20}
                          width={20}
                        />
                      ) : (
                        <Image
                          src="/icons/eye.svg"
                          alt='user-img'
                          height={20}
                          width={20}
                        />
                      )}
                    </div>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}

                  <div className="text-center mt-1 md:text-right">
                    <Link href="/auth/forgot-password" className="text-sm text-orange-500 hover:text-orange-700 ">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                  >
                    {isPending ? 'Ingresando...' : 'Iniciar Sesión'}
                  </button>
                </div>
              </form>
              {/* Registro */}
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">¿No tienes una cuenta? </span>
                <Link href="/register" className="text-sm text-orange-500 hover:text-orange-700 font-medium">
                  Regístrate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage