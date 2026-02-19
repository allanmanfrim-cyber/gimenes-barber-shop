import { ReactNode } from 'react'
import { useTheme } from '../context/ThemeContext'
import { ChevronLeft } from 'lucide-react'


interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
  title?: string
  onBack?: () => void
}

export function Layout({ children, showHeader = true, title, onBack }: LayoutProps) {
  const { config } = useTheme();
  

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary-500/30">
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.03]">
          <div className="max-w-lg mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
               {onBack ? (
                 <button 
                  onClick={onBack}
                  className="w-10 h-10 rounded-full bg-neutral-900 border border-white/[0.05] flex items-center justify-center hover:border-primary-500 transition-colors"
                 >
                   <ChevronLeft className="w-5 h-5 text-primary-500" />
                 </button>
               ) : (
                <div className="w-10 h-10 bg-neutral-900 rounded-xl overflow-hidden p-1.5 border border-white/[0.05]">
                  <img src={config.logotipo_url || "/images/logo.png"} alt="Logo" className="w-full h-full object-contain" />
                </div>
               )}
              <div>
                <h1 className="text-white font-bold tracking-tight text-sm uppercase">{config.nome_barbearia}</h1>
                {title && <p className="text-primary-500 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">{title}</p>}
              </div>
            </div>
          </div>
        </header>
      )}
      <main className={`max-w-lg mx-auto px-6 ${showHeader ? 'pt-32' : 'pt-10'} pb-20`}>
        {children}
      </main>
    </div>
  )
}





