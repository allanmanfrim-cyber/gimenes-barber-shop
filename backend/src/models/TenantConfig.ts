import { db } from "../database/init.js"

export interface TenantConfig {
  id: number
  tenant_id: string
  nome_barbearia: string
  logotipo_url: string
  favicon_url: string
  cor_primaria: string
  cor_secundaria: string
  cor_fundo: string
  modo_tema: string
  whatsapp: string
  telefone: string
  instagram: string
  endereco: string
  horario_funcionamento: string
}

export const TenantConfigModel = {
  findByTenantId(tenantId: string = "default"): TenantConfig | undefined {
    return db.prepare("SELECT * FROM tenant_config WHERE tenant_id = ?").get(tenantId) as TenantConfig
  },

  update(tenantId: string, data: Partial<TenantConfig>): TenantConfig | undefined {
    const fields = Object.keys(data).filter(key => key !== "id" && key !== "tenant_id" && key !== "criado_em")
    const setClause = fields.map(field => `${field} = ?`).join(", ")
    const values = fields.map(field => (data as any)[field])
    
    db.prepare(`UPDATE tenant_config SET ${setClause}, atualizado_em = CURRENT_TIMESTAMP WHERE tenant_id = ?`)
      .run(...values, tenantId)
      
    return this.findByTenantId(tenantId)
  }
}