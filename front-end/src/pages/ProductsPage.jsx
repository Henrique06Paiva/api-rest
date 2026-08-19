import React, { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'

export default function ProductsPage({ onCountChange }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  // Estado do formulário de criação
  const [formData, setFormData] = useState({ name: '', price: '' })

  // Estado para edição
  const [editingProduct, setEditingProduct] = useState(null)
  const [editPrice, setEditPrice] = useState('')

  useEffect(() => {
    fetchProductsList()
  }, [])

  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000)
  }

  const fetchProductsList = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
      if (onCountChange) onCountChange(data.length)
    } catch (err) {
      console.error(err)
      showFeedback('error', 'Falha ao buscar produtos. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  // Criação de produto
  const handleSubmit = async (e) => {
    e.preventDefault()
    const numericPrice = parseFloat(formData.price)

    if (!formData.name.trim() || isNaN(numericPrice) || numericPrice < 0) {
      showFeedback('error', 'Por favor, informe um nome válido e um preço maior ou igual a zero.')
      return
    }

    setSubmitting(true)
    try {
      await createProduct({
        name: formData.name.trim(),
        price: numericPrice,
      })
      showFeedback('success', `Produto "${formData.name}" cadastrado com sucesso!`)
      setFormData({ name: '', price: '' })
      await fetchProductsList()
    } catch (err) {
      console.error(err)
      showFeedback('error', 'Erro ao cadastrar produto.')
    } finally {
      setSubmitting(false)
    }
  }

  // Prepara edição
  const startEditing = (product) => {
    setEditingProduct(product)
    setEditPrice(product.price !== undefined ? String(product.price) : '')
  }

  const cancelEditing = () => {
    setEditingProduct(null)
    setEditPrice('')
  }

  // Salva edição de preço
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    const numericPrice = parseFloat(editPrice)
    if (isNaN(numericPrice) || numericPrice < 0) {
      showFeedback('error', 'Informe um preço válido.')
      return
    }

    try {
      await updateProduct(editingProduct.name, { price: numericPrice })
      showFeedback('success', `Preço do produto "${editingProduct.name}" atualizado!`)
      setEditingProduct(null)
      await fetchProductsList()
    } catch (err) {
      console.error(err)
      showFeedback('error', 'Erro ao atualizar produto.')
    }
  }

  // Deleta produto
  const handleDelete = async (name) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      return
    }

    try {
      await deleteProduct(name)
      showFeedback('success', `Produto "${name}" excluído com sucesso!`)
      await fetchProductsList()
    } catch (err) {
      console.error(err)
      showFeedback('error', 'Erro ao excluir produto.')
    }
  }

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase()
    return p.name ? p.name.toLowerCase().includes(term) : false
  })

  return (
    <div className="page-container">
      {feedback.message && (
        <div className={`alert-banner ${feedback.type}`}>
          <span>{feedback.type === 'success' ? '✅' : '⚠️'}</span>
          <p>{feedback.message}</p>
        </div>
      )}

      <div className="content-grid">
        {/* Painel Esquerdo: Formulário de Cadastro */}
        <section className="card form-card">
          <div className="card-header">
            <h3>➕ Novo Produto</h3>
            <p>Cadastre um item no catálogo</p>
          </div>

          <form onSubmit={handleSubmit} className="app-form">
            <div className="form-group">
              <label htmlFor="prod-name">Nome do Produto</label>
              <input
                id="prod-name"
                type="text"
                placeholder="Ex: Teclado Mecânico RGB"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-price">Preço (R$)</label>
              <input
                id="prod-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 249.90"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Cadastrando...' : 'Cadastrar Produto'}
            </button>
          </form>
        </section>

        {/* Painel Direito: Lista de Produtos */}
        <section className="card list-card">
          <div className="card-header list-header">
            <div>
              <h3>📦 Catálogo de Produtos</h3>
              <p>Gerencie preços e estoque</p>
            </div>

            <div className="header-actions">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Buscar produto por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-secondary btn-icon"
                onClick={fetchProductsList}
                title="Atualizar lista"
              >
                🔄
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Carregando produtos do Firestore...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏷️</div>
              <h4>Nenhum produto cadastrado</h4>
              <p>
                {search
                  ? 'Nenhum resultado encontrado para a busca.'
                  : 'Cadastre seu primeiro produto no formulário ao lado.'}
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div className="product-card" key={product.id || product.name}>
                  <div className="product-card-body">
                    <div className="product-badge">Item</div>
                    <h4 className="product-title">{product.name}</h4>
                    <div className="product-price">
                      {typeof product.price === 'number'
                        ? product.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        : `R$ ${product.price}`}
                    </div>
                    <span className="badge-id">ID: {product.id || 'N/A'}</span>
                  </div>

                  <div className="product-card-actions">
                    <button
                      className="btn-action edit"
                      onClick={() => startEditing(product)}
                      title="Editar Preço"
                    >
                      ✏️ Editar Preço
                    </button>
                    <button
                      className="btn-action delete"
                      onClick={() => handleDelete(product.name)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal de Edição de Preço */}
      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✏️ Alterar Preço</h3>
              <button className="btn-close" onClick={cancelEditing}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="app-form">
              <p className="modal-subtitle">
                Atualizando valor para o produto <strong>{editingProduct.name}</strong>
              </p>

              <div className="form-group">
                <label>Novo Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelEditing}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Atualizar Preço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
