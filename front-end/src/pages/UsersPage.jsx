import React, { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService'

export default function UsersPage({ onCountChange }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  // Estado do formulário de criação
  const [formData, setFormData] = useState({ name: '', email: '' })

  // Estado para edição
  const [editingUser, setEditingUser] = useState(null)
  const [editFormData, setEditFormData] = useState({ newName: '', email: '' })

  // Carrega os usuários ao montar o componente
  useEffect(() => {
    fetchUsersList()
  }, [])

  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000)
  }

  const fetchUsersList = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
      if (onCountChange) onCountChange(data.length)
    } catch (err) {
      console.error(err)
      showFeedback('error', 'Falha ao buscar usuários. Verifique se o backend está rodando na porta 3000.')
    } finally {
      setLoading(false)
    }
  }

  // Lida com a criação de um novo usuário
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      showFeedback('error', 'Por favor, preencha o nome e o e-mail.')
      return
    }

    setSubmitting(true)
    try {
      await createUser(formData)
      showFeedback('success', `Usuário "${formData.name}" cadastrado com sucesso!`)
      setFormData({ name: '', email: '' })
      await fetchUsersList()
    } catch (err) {
      console.error(err)
      showFeedback('error', 'Erro ao cadastrar usuário.')
    } finally {
      setSubmitting(false)
    }
  }

  // Prepara o usuário para edição
  const startEditing = (user) => {
    setEditingUser(user)
    setEditFormData({ newName: user.name, email: user.email || '' })
  }

  const cancelEditing = () => {
    setEditingUser(null)
    setEditFormData({ newName: '', email: '' })
  }

  // Salva a edição do usuário
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editFormData.newName.trim() || !editFormData.email.trim()) {
      showFeedback('error', 'Nome e e-mail não podem ficar vazios.')
      return
    }

    try {
      await updateUser(editingUser.name, {
        newName: editFormData.newName,
        email: editFormData.email,
      })
      showFeedback('success', `Usuário "${editingUser.name}" atualizado com sucesso!`)
      setEditingUser(null)
      await fetchUsersList()
    } catch (err) {
      console.error(err)
      showFeedback('error', 'Erro ao atualizar usuário.')
    }
  }

  // Deleta o usuário
  const handleDelete = async (name) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${name}"?`)) {
      return
    }

    try {
      await deleteUser(name)
      showFeedback('success', `Usuário "${name}" excluído com sucesso!`)
      await fetchUsersList()
    } catch (err) {
      console.error(err)
      showFeedback('error', 'Erro ao excluir usuário.')
    }
  }

  // Filtra os usuários pela busca
  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase()
    const nameMatch = u.name ? u.name.toLowerCase().includes(term) : false
    const emailMatch = u.email ? u.email.toLowerCase().includes(term) : false
    return nameMatch || emailMatch
  })

  return (
    <div className="page-container">
      {/* Alerta de Feedback */}
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
            <h3>➕ Novo Usuário</h3>
            <p>Cadastre um novo usuário no Firestore</p>
          </div>

          <form onSubmit={handleSubmit} className="app-form">
            <div className="form-group">
              <label htmlFor="user-name">Nome Completo</label>
              <input
                id="user-name"
                type="text"
                placeholder="Ex: Henrique Paiva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-email">E-mail</label>
              <input
                id="user-email"
                type="email"
                placeholder="Ex: henrique@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Cadastrando...' : 'Cadastrar Usuário'}
            </button>
          </form>
        </section>

        {/* Painel Direito: Listagem e Gestão de Usuários */}
        <section className="card list-card">
          <div className="card-header list-header">
            <div>
              <h3>👥 Lista de Usuários</h3>
              <p>Gerencie os registros existentes</p>
            </div>

            <div className="header-actions">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Buscar por nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-secondary btn-icon"
                onClick={fetchUsersList}
                title="Atualizar lista"
              >
                🔄
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Carregando usuários do Firestore...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h4>Nenhum usuário encontrado</h4>
              <p>
                {search
                  ? 'Nenhum resultado para os termos da busca.'
                  : 'Cadastre seu primeiro usuário no formulário ao lado.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>ID (Firestore)</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id || user.name}>
                      <td className="font-semibold">{user.name}</td>
                      <td className="text-muted">{user.email}</td>
                      <td>
                        <span className="badge-id">{user.id || 'N/A'}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons">
                          <button
                            className="btn-action edit"
                            onClick={() => startEditing(user)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => handleDelete(user.name)}
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Modal de Edição */}
      {editingUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✏️ Editar Usuário</h3>
              <button className="btn-close" onClick={cancelEditing}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="app-form">
              <p className="modal-subtitle">
                Editando registro de <strong>{editingUser.name}</strong>
              </p>

              <div className="form-group">
                <label>Novo Nome</label>
                <input
                  type="text"
                  value={editFormData.newName}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, newName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Novo E-mail</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  required
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
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
