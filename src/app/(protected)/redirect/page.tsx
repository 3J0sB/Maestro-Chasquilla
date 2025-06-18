"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

import { signOut } from "next-auth/react"

export default function RedirectPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [message, setMessage] = useState("Verificando tus credenciales...")

    const [timeoutReached, setTimeoutReached] = useState(false)
    const [retryCount, setRetryCount] = useState(0)

    // Función para reintentar la autenticación
    const handleRetry = () => {
        setTimeoutReached(false)
        setMessage("Reintentando verificar tus credenciales...")
        setRetryCount(prev => prev + 1)
        
        // Forzar una actualización de la sesión
        router.refresh()
    }

    // Función para limpiar la sesión y redirigir al login
    const handleClearSession = async () => {
        setMessage("Limpiando sesión...")
        try {
            await signOut({ redirect: false })
            router.push("/login")
        } catch (error) {
            console.error("Error al cerrar sesión:", error)
            // Redirección forzada en caso de error
            window.location.href = "/login"
        }
    }

    useEffect(() => {
        // Configurar un timeout graduado - primero corto, luego más largo
        const timeoutDuration = retryCount === 0 ? 5000 : 8000
        
        const maxTimeout = setTimeout(() => {
            if (status === "loading") {
                setTimeoutReached(true)
                setMessage("La verificación está tardando más de lo esperado...")

            }
        }, timeoutDuration)

        // Reintento automático limitado (máximo 2 intentos)
        const autoRetryTimeout = setTimeout(() => {
            if (status === "loading" && retryCount < 2) {
                console.log("Reintentando automáticamente...")
                handleRetry()
            }
        }, timeoutDuration + 2000)

        // Lógica de redirección basada en el estado de la sesión
        if (status === "loading") {
            return () => {
                clearTimeout(maxTimeout)
                clearTimeout(autoRetryTimeout)
            }
        }

        // Limpiar los timeouts
        clearTimeout(maxTimeout)
        clearTimeout(autoRetryTimeout)

        if (status === "unauthenticated") {
            console.log("No autenticado, redirigiendo a login")
            router.push("/login")
            return
        }

        if (session) {
            console.log("Sesión encontrada:", session.user?.role)
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

            // Registrar datos antes de redirección
            console.log(`Redirigiendo a ${redirectPath} para rol ${userRole}`)

            const redirectTimer = setTimeout(() => {
                router.push(redirectPath)
            }, 500)

            return () => clearTimeout(redirectTimer)
        }

        return () => {
            clearTimeout(maxTimeout)
            clearTimeout(autoRetryTimeout)
        }
    }, [session, status, router, retryCount, handleRetry])

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
                        priority={true}
                    />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    ¡Bienvenido{session?.user?.name ? `, ${session.user.name}` : ''}!
                </h1>

                <p className="text-gray-600 mb-4">{message}</p>

                {timeoutReached && (
                    <div className="mb-6 text-sm">
                        <p className="text-orange-600 mb-2">
                            {retryCount >= 2 
                                ? "Seguimos teniendo problemas para verificar tu sesión." 
                                : "Hay un problema con la verificación de tu sesión."}
                        </p>
                        
                        <div className="text-gray-500 mb-4 text-xs px-4">
                            <p>Esto puede deberse a problemas de conexión o del servidor.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-3">
                            <button 
                                onClick={handleClearSession}
                                className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-colors"
                            >
                                Ir al inicio de sesión
                            </button>
                            
                            <button 
                                onClick={handleRetry}
                                disabled={retryCount >= 3}
                                className={`border px-4 py-2 rounded-md transition-colors ${
                                    retryCount >= 3 
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed" 
                                        : "border-orange-500 text-orange-500 hover:bg-orange-50"
                                }`}
                            >
                                {retryCount >= 3 ? "Demasiados intentos" : "Intentar de nuevo"}
                            </button>
                        </div>
                        
                        {retryCount >= 3 && (
                            <p className="text-xs text-gray-500 mt-4">
                                Se ha excedido el número de intentos. Intenta refrescar la página
                                o vuelve más tarde.
                            </p>
                        )}
                    </div>
                )}

                {!timeoutReached && (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                    </div>
                )}
                
                <div className="text-xs text-gray-400 mt-6">
                    Estado: {status} {retryCount > 0 ? `· Intentos: ${retryCount}/3` : ''}
                </div>
            </div>
        </div>
    )
}