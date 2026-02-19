import React, { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Palette, Image as ImageIcon, Phone, MapPin, Clock, Globe } from "lucide-react"

export default function LayoutSettings() {
  const { config: currentConfig } = useTheme()
  const [config, setConfig] = useState(currentConfig)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setConfig(currentConfig)
  }, [currentConfig])

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(config)
      })
      if (response.ok) {
        alert("Layout atualizado com sucesso! Recarregue para aplicar.")
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Personalização do Layout</h1>
        <Button onClick={handleSave} loading={loading}>Salvar Alterações</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-dark-900 p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-primary-500 font-bold mb-4">
            <Palette className="w-5 h-5" />
            <h2>Identidade & Cores</h2>
          </div>
          
          <div className="space-y-4">
            <Input label="Nome da Barbearia" value={config.nome_barbearia} onChange={e => setConfig({...config, nome_barbearia: e.target.value})} />
            <Input label="URL do Logotipo" value={config.logotipo_url} onChange={e => setConfig({...config, logotipo_url: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-dark-400 uppercase font-bold mb-2 block">Cor Primária</label>
                <input type="color" className="w-full h-10 rounded-lg bg-dark-800 border-none cursor-pointer" value={config.cor_primaria} onChange={e => setConfig({...config, cor_primaria: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-dark-400 uppercase font-bold mb-2 block">Cor de Fundo</label>
                <input type="color" className="w-full h-10 rounded-lg bg-dark-800 border-none cursor-pointer" value={config.cor_fundo} onChange={e => setConfig({...config, cor_fundo: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-dark-900 p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-primary-500 font-bold mb-4">
            <Phone className="w-5 h-5" />
            <h2>Contatos & Endereço</h2>
          </div>
          
          <div className="space-y-4">
            <Input label="WhatsApp" value={config.whatsapp} onChange={e => setConfig({...config, whatsapp: e.target.value})} />
            <Input label="Instagram (user)" value={config.instagram} onChange={e => setConfig({...config, instagram: e.target.value})} />
            <Input label="Endereço" value={config.endereco} onChange={e => setConfig({...config, endereco: e.target.value})} />
            <Input label="Horário" value={config.horario_funcionamento} onChange={e => setConfig({...config, horario_funcionamento: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="bg-dark-900 p-8 rounded-3xl border border-white/5">
        <h2 className="text-white font-bold mb-6">Preview em Tempo Real</h2>
        <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: config.cor_fundo }}>
          <div className="p-4 flex items-center justify-between border-b border-white/5">
             <div className="flex items-center gap-2">
               <img src={config.logotipo_url} alt="Logo" className="w-8 h-8 object-contain" />
               <span className="font-bold text-white">{config.nome_barbearia}</span>
             </div>
             <div className="w-20 h-8 rounded-full" style={{ backgroundColor: config.cor_primaria }}></div>
          </div>
          <div className="p-20 text-center">
             <h3 className="text-4xl font-black mb-4" style={{ color: "white" }}>{config.nome_barbearia}</h3>
             <p className="text-dark-400 mb-8">{config.endereco}</p>
             <button className="px-8 py-4 rounded-full font-bold text-dark-900" style={{ backgroundColor: config.cor_primaria }}>Agendar Agora</button>
          </div>
        </div>
      </div>
    </div>
  )
