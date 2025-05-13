'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PublicHeader from '@/components/layout/publicHeader'

type FormValues = {
    email: string
    password: string
    name: string
    rut: string
    lastName: string
    lastName2: string
    confirmPassword: string
}

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const onSubmit = handleSubmit(async (data) => {
        if (data.password !== data.confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    name: data.name,
                    lastName: data.lastName,
                    lastName2: data.lastName2,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.error || "Error al registrar usuario")
            } else {

                router.push('/login')
            }
        } catch (error) {
            setError("Error de conexión al servidor")
        }
    })

    return (

        <div>
            <header>
                <PublicHeader />
            </header>
            <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">

                <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex">
                    {/* Lado izquierdo con imagen */}
                    <div className="hidden justify-center content-center transform-[scaleX(-1)] md:block w-1/2 relative p-6">
                        <Image
                            src="/img/register.svg"
                            width={400}
                            height={400}
                            alt="register illustration"
                            className="object-contain mx-auto "
                            priority
                        />
                    </div>
                    <div className="hidden md:block w-[2px] border rounded-2xl h-auto self-stretch border-gray-200 bg-gray-200 my-6"></div>
                    {/* Lado derecho con formulario */}
                    <div className="w-full md:w-1/2 py-8 px-8 overflow-y-auto max-h-screen">
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
                            <h1 className="text-2xl font-bold text-center mb-2">Crea tu cuenta 
                                <span className='text-orange-500 text-2xl font-bold italic'> Consumidor</span>
                            </h1>
                            <p className="text-gray-500 text-center mb-8">Regístrate para encontrar servicios cerca tuyo</p>

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
                                            <Image src="/icons/mail.svg" alt='user-img' height={20} width={20} />
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Image src="/icons/user.svg" alt='user-img' height={20} width={20} />
                                            </div>
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="Tu nombre"
                                                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                                {...register("name", {
                                                    required: {
                                                        value: true,
                                                        message: "El nombre es requerido"
                                                    }
                                                })}
                                            />
                                        </div>
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Apellido Paterno
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Tu apellido"
                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                            {...register("lastName", {
                                                required: {
                                                    value: true,
                                                    message: "El apellido es requerido"
                                                }
                                            })}
                                        />
                                        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Rut" className="block text-sm font-medium text-gray-700 mb-1">
                                        Rut
                                    </label>
                                    <input
                                        id="Rut"
                                        type="text"
                                        placeholder="ingresa tu rut"
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                        {...register("rut", {
                                            required: {
                                                value: true,
                                                message: "El rut es requerido"
                                            }
                                        }
                                        )}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Image src="/icons/lock-password.svg" alt='user-img' height={20} width={20} />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Crea una contraseña"
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
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Image
                                                src="/icons/lock-check.svg"
                                                alt='user-img'
                                                height={20}
                                                width={20}
                                            />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirma tu contraseña"
                                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                            {...register("confirmPassword", {
                                                required: {
                                                    value: true,
                                                    message: "La confirmación es requerida"
                                                }
                                            })}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
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
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            </form>

                            {/* Login */}
                            <div className="mt-6 text-center">
                                <span className="text-sm text-gray-600">¿Ya tienes una cuenta? </span>
                                <Link href="/login" className="text-sm text-orange-500 hover:text-orange-700 font-medium">
                                    Inicia Sesión
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage