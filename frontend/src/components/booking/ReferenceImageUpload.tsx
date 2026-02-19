import React, { useState } from 'react'
import { X, Upload } from 'lucide-react'

interface ReferenceImageUploadProps {
  onImagesSelected: (images: string[]) => void
  onNext: () => void
  onBack: () => void
}

export function ReferenceImageUpload({ onImagesSelected, onNext, onBack }: ReferenceImageUploadProps) {
  const [images, setImages] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (images.length + files.length > 3) {
      alert('VocÃª pode enviar no mÃ¡ximo 3 fotos.')
      return
    }

    const newImages = [...images]
    const readers = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then(results => {
      const updatedImages = [...newImages, ...results]
      setImages(updatedImages)
      onImagesSelected(updatedImages)
    })
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesSelected(updatedImages)
  }

  return (
    <div className="px-4 py-6 space-y-8 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark-900 mb-2">Fotos de ReferÃªncia</h2>
        <p className="text-dark-500">
          Envie atÃ© 3 fotos do corte que vocÃª deseja para ajudar seu barbeiro.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
            <img src={img} alt={`ReferÃªncia ${index + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {images.length < 3 && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-green-700 hover:bg-gray-50 transition-all">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-6 h-6 text-dark-400 mb-1" />
            <span className="text-[10px] text-dark-400 font-medium">Upload</span>
          </label>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <button
          onClick={onNext}
          className="w-full py-4 bg-dark-900 hover:bg-dark-800 text-white font-semibold rounded-lg transition-all shadow-lg shadow-dark-900/10"
        >
          {images.length === 0 ? 'Pular e Continuar' : 'Continuar'}
        </button>
        <button
          onClick={onBack}
          className="w-full py-4 bg-white hover:bg-gray-50 text-dark-900 font-semibold rounded-lg transition-all border border-gray-200"
        >
          Voltar
        </button>
      </div>
    </div>
  )
}



