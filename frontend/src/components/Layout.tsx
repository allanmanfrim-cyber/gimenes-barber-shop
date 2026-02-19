import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
  title?: string
}

export function Layout({ children, showHeader = true, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-950">
      {showHeader && (
        <header className="bg-dark-900 border-b border-dark-800">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-dark-800 rounded-xl overflow-hidden flex items-center justify-center p-1 border border-dark-700">
                <img src="/images/logo.png" alt="Logotipo Gimenes Barber Shop" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-white font-bold tracking-tight">Gimenes Barber Shop</h1>
                {title && <p className="text-dark-400 text-xs font-medium uppercase tracking-wider mt-0.5">{title}</p>}
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="max-w-lg mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
