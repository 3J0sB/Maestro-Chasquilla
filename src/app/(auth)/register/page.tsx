'use client'
import React from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
    email: string
    password: string
    name: string
    lastName: string
    lastName2: string
    confirmPassword: string
}

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

    const onSubmit = handleSubmit(async (data) => {
        if (data.password !== data.confirmPassword) {
            alert("Las contraseñas no coinciden")
            return
        }

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                name: data.name,
                lastName: data.lastName,
                lastName2: data.lastName2,}
            ),
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
            <div className='bg-white p-8 rounded-lg shadow-md max-w-fit '>
                <h2 className='text-2xl font-bold mb-6 text-center'>REGISTER PAGE</h2>
                <form onSubmit={onSubmit}>
                    <div className='flex flex-col gap-2'>
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
                        <div className='flex justify-between gap-4'>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="name" className='text-md '>Nombre</label>
                                <input type="text" className='border-2 border-black p-2 rounded' placeholder='name'
                                    {...(register("name", {
                                        required: {
                                            value: true,
                                            message: "El nombre es requerido"
                                        }
                                    }))}
                                />
                                {
                                    errors.name && <span className='text-red-500'>{errors.name.message}</span>
                                }
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="lastName" className='text-md '>Apellido Paterno</label>
                                <input type="text" className='border-2 border-black p-2 rounded' placeholder='last name'
                                    {...(register("lastName", {
                                        required: {
                                            value: true,
                                            message: "El apellido es requerido"
                                        }
                                    }))}
                                />
                                {
                                    errors.lastName && <span className='text-red-500'>{errors.lastName.message}</span>
                                }
                            </div>

                        </div>
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
