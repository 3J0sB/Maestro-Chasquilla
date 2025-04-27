'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { loginAction } from '../../../../actions/auth-actions'
type FormValues = {
  email: string
  password: string
}



function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const router = useRouter()
  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    const res = await loginAction(data.email, data.password)
    console.log(res)
  })
  return (
    <div className='h-screen w-full bg-amber-200 flex justify-center items-center'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-fit '>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login Page</h2>
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

            <button className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors'>
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage