"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function RedirectPage() {

    const { data: session, status } = useSession()
    // console.log("[REDIRECT]--> session", session)
    const router = useRouter()
    const [message, setMessage] = useState("Verificando tus credenciales...")

    useEffect(() => {
        if (status === "loading") {
            return
        }

        if (!session) {
            router.push("/auth/login")
            return
        }
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

                <p className="text-gray-600 mb-8">{message}</p>

                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                </div>
            </div>
        </div>
    )
}