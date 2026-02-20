import React, { useState } from 'react'
import { X, Upload, Star, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'

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
      alert('Você pode enviar no máximo 3 fotos.')
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-2 mb-2 px-2">
        <Star className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
        <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em]">Referência de Corte</span>
      </div>

      <div className="bg-neutral-900/50 border border-white/[0.05] rounded-3xl p-6 space-y-6">
        <p className="text-neutral-400 text-sm font-medium leading-relaxed">
          Deseja enviar fotos de referência para o seu barbeiro? Você pode enviar até 3 imagens que ajudem a ilustrar o resultado desejado.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
              <img src={img} alt={`Referência ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500/50 hover:bg-white/[0.02] transition-all group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-neutral-600 group-hover:text-primary-500 transition-colors mb-2" />
              <span className="text-[10px] text-neutral-600 group-hover:text-neutral-400 font-black uppercase tracking-widest">Upload</span>
            </label>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6 max-w-lg mx-auto md:relative md:bottom-0 md:left-0 md:right-0">
        <Button onClick={onNext} fullWidth className="h-16 rounded-full bg-primary-500 text-black border-none font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_30px_rgba(197,160,89,0.3)] hover:scale-105 transition-all">
          {images.length === 0 ? 'Pular e Continuar' : 'Próximo Passo'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
