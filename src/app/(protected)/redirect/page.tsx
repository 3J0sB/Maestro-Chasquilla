"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function RedirectPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [message, setMessage] = useState("Verificando tus credenciales...")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [timeoutReached, setTimeoutReached] = useState(false)

    useEffect(() => {
        // Configurar un timeout máximo de espera (10 segundos)
        const maxTimeout = setTimeout(() => {
            if (status === "loading") {
                setTimeoutReached(true)
                setMessage("La verificación está tardando más de lo esperado...")
                setLoading(false)
                setError(true)
            }
        }, 5000)

        // Lógica de redirección basada en el estado de la sesión
        if (status === "loading") {
            return () => clearTimeout(maxTimeout)
        }

        // Limpiar el timeout si ya cargó
        clearTimeout(maxTimeout)

        if (status === "unauthenticated") {
            router.push("/login")
            return
        }

        if (session) {
            const userRole = session?.user?.role
            let redirectPath = "/"

            switch (userRole) {
                case "SERVICE_PROVIDER":
                    redirectPath = "/service-provider/home"
                    setMessage("Redirigiendo al panel de proveedor de servicios...")
                    break
                case "ADMIN":
                    redirectPath = "/admin/home"
                    setMessage("Redirigiendo al panel de administración...")
                    break
                case "USER":
                    redirectPath = "/services"
                    setMessage("Redirigiendo a tu panel personal...")
                    break
                default:
                    redirectPath = "/"
                    setMessage("Redirigiendo a la página principal...")
            }


            const redirectTimer = setTimeout(() => {
                router.push(redirectPath)
            }, 500)

            return () => clearTimeout(redirectTimer)
        }

        return () => clearTimeout(maxTimeout)
    }, [session, status, router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <Image
                        src="/img/miau.jpg"
                        width={60}
                        height={60}
                        alt='logo'
                        className="rounded-full"
                    />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    ¡Bienvenido{session?.user?.name ? `, ${session.user.name}` : ''}!
                </h1>

                <p className="text-gray-600 mb-4">{message}</p>

                {timeoutReached && (
                    <div className="mb-6 text-sm">
                        <p className="text-orange-600 mb-2">
                            Hay un problema con la verificación de tu sesión.
                        </p>
                        <div className="flex justify-center space-x-4 mt-3">
                            <Link 
                                href="/auth/login" 
                                className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                            <button 
                                onClick={() => window.location.reload()}
                                className="text-orange-500 border border-orange-500 hover:bg-orange-50 px-4 py-2 rounded-md transition-colors"
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    </div>
                )}

                {!timeoutReached && (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                    </div>
                )}
            </div>
        </div>
    )
}