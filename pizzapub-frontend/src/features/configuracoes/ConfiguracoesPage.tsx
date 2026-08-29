import { useState } from 'react'
import { useConfigStore } from '@/store/config.store'
import { Button } from '@/components/ui/Button'
import { Upload, Trash2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './ConfiguracoesPage.module.css'

export function ConfiguracoesPage() {
  const {
    nomeEmpresa,
    slogan,
    telefone,
    endereco,
    logoUrl,
    setNomeEmpresa,
    setSlogan,
    setTelefone,
    setEndereco,
    setLogoUrl,
  } = useConfigStore()

  const [formNome, setFormNome] = useState(nomeEmpresa)
  const [formSlogan, setFormSlogan] = useState(slogan)
  const [formTelefone, setFormTelefone] = useState(telefone)
  const [formEndereco, setFormEndereco] = useState(endereco)
  const [previewLogo, setPreviewLogo] = useState<string | null>(logoUrl)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 2MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setPreviewLogo(null)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setNomeEmpresa(formNome.trim() || 'PizzaPub')
    setSlogan(formSlogan.trim())
    setTelefone(formTelefone.trim())
    setEndereco(formEndereco.trim())
    setLogoUrl(previewLogo)
    toast.success('Configurações salvas com sucesso!')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Identidade & Configurações</h1>
        <span className={styles.subtitle}>Personalize a logo, nome e contatos do seu estabelecimento</span>
      </div>

      <form onSubmit={handleSave} className={styles.formCard}>
        {/* Seção de Logo */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🖼️ Logotipo da Empresa</h2>
          <p className={styles.sectionDesc}>Esta imagem aparecerá no cabeçalho do cardápio, no painel gerencial e nos pedidos.</p>

          <div className={styles.logoUploadArea}>
            <div className={styles.logoPreviewWrap}>
              {previewLogo ? (
                <img src={previewLogo} alt="Logo Preview" className={styles.logoPreview} />
              ) : (
                <div className={styles.logoPlaceholder}>
                  <span className={styles.logoEmoji}>🍕</span>
                  <span className={styles.logoPlaceholderText}>Sem logo personalizada</span>
                </div>
              )}
            </div>

            <div className={styles.uploadControls}>
              <label className={styles.uploadBtn}>
                <Upload size={18} />
                <span>Escolher Nova Imagem</span>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>

              {previewLogo && (
                <button type="button" className={styles.removeBtn} onClick={handleRemoveLogo}>
                  <Trash2 size={16} /> Remover Logo
                </button>
              )}
              <span className={styles.helpText}>Formatos aceitos: PNG, JPG, SVG ou WebP (máx. 2MB).</span>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* Informações da Empresa */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏢 Informações do Estabelecimento</h2>
          
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nome do Estabelecimento *</label>
              <input
                type="text"
                className={styles.input}
                value={formNome}
                onChange={e => setFormNome(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Slogan ou Subtítulo</label>
              <input
                type="text"
                className={styles.input}
                value={formSlogan}
                onChange={e => setFormSlogan(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Telefone / WhatsApp</label>
              <input
                type="text"
                className={styles.input}
                value={formTelefone}
                onChange={e => setFormTelefone(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Endereço Comercial</label>
              <input
                type="text"
                className={styles.input}
                value={formEndereco}
                onChange={e => setFormEndereco(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className={styles.formFooter}>
          <Button type="submit" size="lg">
            <CheckCircle2 size={18} /> Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  )
}
