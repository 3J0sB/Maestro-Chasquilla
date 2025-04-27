'use client'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { loginAction } from '../../../../actions/auth-actions'
import { start } from 'repl'
type FormValues = {
  email: string
  password: string
}



function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    startTransition(async () => {
      const res = await loginAction(data.email, data.password)
      console.log(res)

      if(res.error) {
        setError(res.error)
       
      }else {
        setError(null)
        router.push("/home")
      }
    })
  })
  return (
    <div className='h-screen w-full bg-amber-200 flex justify-center items-center'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-fit '>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login Page</h2>
        <div className='flex justify-center'>
        {error && <span className='text-red-500 text-center'>{error}</span>}
        </div>
        
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

            <button disabled={isPending} className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors'>
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage