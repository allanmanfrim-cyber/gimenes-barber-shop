import { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Palette, Phone, Star, Eye, ShieldCheck } from "lucide-react"
import { AdminLayout } from "../../components/admin/AdminLayout"

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
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(config)
      })
      if (response.ok) {
        alert("Layout atualizado com sucesso!")
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Design & Layout">
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/[0.03]">
          <div>
            <h2 className="text-[10px] text-primary-500 font-black uppercase tracking-[0.4em] mb-2">Enterprise Edition</h2>
            <p className="text-neutral-500 text-sm font-medium">Personalize a identidade visual e os dados institucionais da sua barbearia.</p>
          </div>
          <Button 
            onClick={handleSave} 
            loading={loading}
            className="h-14 px-10 rounded-full bg-primary-500 text-black border-none font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(197,160,89,0.2)] hover:scale-105 transition-all"
          >
            Salvar Alterações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 bg-neutral-900/40 p-8 rounded-3xl border border-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                <Palette className="w-5 h-5 text-primary-500" />
              </div>
              <h3 className="text-white font-black uppercase tracking-tight">Identidade Visual</h3>
            </div>
            
            <div className="space-y-6">
              <Input 
                label="Nome da Barbearia" 
                value={config.nome_barbearia} 
                onChange={e => setConfig({...config, nome_barbearia: e.target.value})} 
              />
              <Input 
                label="URL do Logotipo (PNG Recomendado)" 
                value={config.logotipo_url} 
                onChange={e => setConfig({...config, logotipo_url: e.target.value})} 
              />
              
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-primary-500/80 uppercase tracking-[0.2em] mb-3 ml-1">Cor Primária</label>
                  <div className="flex items-center gap-3 p-1.5 bg-black rounded-2xl border border-white/[0.05] group-focus-within:border-primary-500/30 transition-all">
                    <input 
                      type="color" 
                      className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer overflow-hidden" 
                      value={config.cor_primaria} 
                      onChange={e => setConfig({...config, cor_primaria: e.target.value})} 
                    />
                    <span className="text-xs font-black text-white uppercase tracking-widest">{config.cor_primaria}</span>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-primary-500/80 uppercase tracking-[0.2em] mb-3 ml-1">Cor de Fundo</label>
                  <div className="flex items-center gap-3 p-1.5 bg-black rounded-2xl border border-white/[0.05] group-focus-within:border-primary-500/30 transition-all">
                    <input 
                      type="color" 
                      className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer overflow-hidden" 
                      value={config.cor_fundo} 
                      onChange={e => setConfig({...config, cor_fundo: e.target.value})} 
                    />
                    <span className="text-xs font-black text-white uppercase tracking-widest">{config.cor_fundo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-neutral-900/40 p-8 rounded-3xl border border-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                <Phone className="w-5 h-5 text-primary-500" />
              </div>
              <h3 className="text-white font-black uppercase tracking-tight">Informações de Contato</h3>
            </div>
            
            <div className="space-y-6">
              <Input 
                label="WhatsApp (com DDD)" 
                value={config.whatsapp} 
                onChange={e => setConfig({...config, whatsapp: e.target.value})} 
              />
              <Input 
                label="Instagram (@usuario)" 
                value={config.instagram} 
                onChange={e => setConfig({...config, instagram: e.target.value})} 
              />
              <Input 
                label="Endereço Completo" 
                value={config.endereco} 
                onChange={e => setConfig({...config, endereco: e.target.value})} 
              />
              <Input 
                label="Horário de Funcionamento" 
                value={config.horario_funcionamento} 
                onChange={e => setConfig({...config, horario_funcionamento: e.target.value})} 
              />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/30 border border-white/[0.03] rounded-[40px] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 transition-transform duration-700">
             <Eye className="w-40 h-40 text-white" />
          </div>

          <div className="flex items-center gap-4 mb-10 relative z-10">
             <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                <Star className="w-5 h-5 text-primary-500" />
             </div>
             <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Preview do Cliente</h3>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Veja como seus clientes visualizarão sua barbearia</p>
             </div>
          </div>

          <div className="border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative z-10 max-w-2xl mx-auto transition-all duration-500 group-hover:shadow-primary-500/5" style={{ backgroundColor: config.cor_fundo }}>
            <div className="p-6 flex items-center justify-between border-b border-white/[0.03] bg-black/40 backdrop-blur-md">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-neutral-900 rounded-lg p-1.5 border border-white/5">
                    <img src={config.logotipo_url || "/images/logo.png"} alt="Logo" className="w-full h-full object-contain" />
                 </div>
                 <span className="font-black text-white uppercase tracking-tight text-sm">{config.nome_barbearia}</span>
               </div>
               <div className="w-24 h-8 rounded-full shadow-lg" style={{ backgroundColor: config.cor_primaria }}></div>
            </div>
            <div className="p-20 text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
               <h4 className="text-5xl font-black mb-4 uppercase tracking-tighter relative z-10" style={{ color: "white" }}>{config.nome_barbearia}</h4>
               <p className="text-neutral-500 mb-10 font-medium relative z-10">{config.endereco}</p>
               <button className="px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl relative z-10" style={{ backgroundColor: config.cor_primaria, color: 'black' }}>
                  Agendar Agora
               </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 mt-10">
             <ShieldCheck className="w-4 h-4 text-neutral-700" />
             <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">Configurações de Tenant Ativas</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}




