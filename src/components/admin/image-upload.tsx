'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useUploadThing } from '@/lib/uploadthing'
import { X, Upload, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
}

export default function ImageUpload({ value, onChange, maxFiles = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { startUpload } = useUploadThing('productImage')

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Verificar limite de arquivos
    if (value.length + files.length > maxFiles) {
      alert(`Você pode enviar no máximo ${maxFiles} imagens`)
      return
    }

    setIsUploading(true)

    try {
      const uploadedFiles = await startUpload(Array.from(files))

      if (!uploadedFiles) {
        throw new Error('Erro ao fazer upload')
      }

      const newUrls = uploadedFiles.map((file) => file.url)
      onChange([...value, ...newUrls])
    } catch (error) {
      console.error(error)
      alert('Erro ao fazer upload das imagens')
    } finally {
      setIsUploading(false)
    }
  }

  function removeImage(url: string) {
    onChange(value.filter((img) => img !== url))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((url) => (
          <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
            <Image src={url} alt="Product image" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {value.length < maxFiles && (
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
              className="sr-only"
            />
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-500">Enviando...</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Adicionar Imagem</span>
                <span className="text-xs text-gray-400">
                  {value.length}/{maxFiles}
                </span>
              </>
            )}
          </label>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, WebP. Tamanho máximo: 4MB por imagem. Máximo de {maxFiles} imagens.
      </p>
    </div>
  )
}
