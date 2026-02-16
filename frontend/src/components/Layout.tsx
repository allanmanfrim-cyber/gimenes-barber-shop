import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
  title?: string
  showBackButton?: boolean
  onBack?: () => void
}

export function Layout({ children, showHeader = true, title, showBackButton = false, onBack }: LayoutProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {showHeader && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-dark-600 hover:text-dark-900 transition-colors mr-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm">Voltar</span>
                </button>
              )}
              <div className="flex-1 flex justify-center">
                <img src="/images/logo.png" alt="Gimenes Barber Shop" className="h-12" />
              </div>
              {showBackButton && <div className="w-16" />}
            </div>
          </div>
        </header>
      )}
      <main className="max-w-lg mx-auto">
        {children}
      </main>
    </div>
  )
}
