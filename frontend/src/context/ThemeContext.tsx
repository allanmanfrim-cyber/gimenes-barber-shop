import React, { createContext, useContext, useState, useEffect } from "react"

export interface TenantConfig {
  nome_barbearia: string
  logotipo_url: string
  cor_primaria: string
  cor_secundaria: string
  cor_fundo: string
  whatsapp: string
  instagram: string
  endereco: string
  horario_funcionamento: string
}

interface ThemeContextType {
  config: TenantConfig
  loading: boolean
}

const defaultTheme: TenantConfig = {
  nome_barbearia: "Gimenes Barber Shop",
  logotipo_url: "/images/logo.png",
  cor_primaria: "#eab308",
  cor_secundaria: "#171717",
  cor_fundo: "#0a0a0a",
  whatsapp: "17992195185",
  instagram: "gimenes_barber",
  endereco: "R. Ademar de Barros, 278, Centro - José Bonifácio/SP",
  horario_funcionamento: "Seg-Sex: 09h às 20h, Sáb: 08h às 18h"
}

const ThemeContext = createContext<ThemeContextType>({ config: defaultTheme, loading: true })

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<TenantConfig>(defaultTheme)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/config")
        if (response.ok) {
          const data = await response.json()
          if (data.config) {
            setConfig(data.config)
            applyTheme(data.config)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar tema:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const applyTheme = (theme: TenantConfig) => {
    const root = document.documentElement
    root.style.setProperty("--primary-color", theme.cor_primaria)
    root.style.setProperty("--secondary-color", theme.cor_secundaria)
    root.style.setProperty("--background-color", theme.cor_fundo)
  }

  return (
    <ThemeContext.Provider value={{ config, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
