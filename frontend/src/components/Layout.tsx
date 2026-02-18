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
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-dark-900 font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-white font-semibold">Gimenes Barber Shop</h1>
                {title && <p className="text-dark-400 text-sm">{title}</p>}
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
