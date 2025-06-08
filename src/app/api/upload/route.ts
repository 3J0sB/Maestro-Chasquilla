import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getSession } from 'next-auth/react'


// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ninguna imagen' }, { status: 400 })
    }
    
 
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe superar los 5MB' }, { status: 400 })
    }
    
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 })
    }
    
   
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    

    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'maestro-chasquilla/profiles',
          resource_type: 'image',
 
          transformation: [
            { width: 400, height: 400, crop: 'limit' },
            { quality: 'auto:good' },
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      
      // Enviar buffer al stream
      uploadStream.write(buffer)
      uploadStream.end()
    })
    
    const result: any = await uploadPromise
    
    return NextResponse.json({ 
      imageUrl: result.secure_url,
      publicId: result.public_id 
    })
  } catch (error) {
    console.error('Error al subir imagen:', error)
    return NextResponse.json({ error: 'Error al procesar la imagen' }, { status: 500 })
  }
}