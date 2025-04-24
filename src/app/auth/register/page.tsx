'use client'
import React from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
    email: string
    password: string
    confirmPassword: string
  }

function RegisterPage() {
    const { register, handleSubmit, formState: {errors} } = useForm<FormValues>()

    const onSubmit = handleSubmit( async (data) => {
       
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const result = await res.json()
        console.log(result)
    })
    
    console.log(errors)
    return (
        <div className='h-screen w-full bg-amber-200 flex justify-center items-center'>
            <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6 text-center'>REGISTER PAGE</h2>
                <form onSubmit={onSubmit}>
                    <div className='flex flex-col gap-4'>
                        <label htmlFor="email" className='text-md '>Correo</label>
                        <input type="email" className='border-2 border-black p-2 rounded' placeholder='email'
                            {...(register("email", {
                                required: {
                                    value: true,
                                    message: "El correo es requerido"
                                }
                            }))}
                        />
                        {
                            errors.email && <span className='text-red-500'>{errors.email.message}</span>
                        }
                        <label htmlFor="password" className='text-md '>Contraseña</label>
                        <input type="password" className='border-2 border-black p-2 rounded' placeholder='password'
                            {...(register("password", {
                                required: {
                                    value: true,
                                    message: "La contraseña es requerida"
                                }
                            }))}
                        />
                        {
                            errors.password && <span className='text-red-500'>{errors.password.message}</span>
                        }
                        <label htmlFor="password" className='text-md '>Confirmar Contraseña</label>
                        <input type="password" className='border-2 border-black p-2 rounded' placeholder='confirm password'
                            {...(register("confirmPassword", {
                                required: {
                                    value: true,
                                    message: "la confimacion es requerida"
                                }
                            }))}
                        />
                        {
                            errors.confirmPassword && <span className='text-red-500'>{errors.confirmPassword.message}</span>
                        }
                        <button className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors'>
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage
