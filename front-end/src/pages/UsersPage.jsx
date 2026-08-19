import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

// Inline SVG icons
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const RefreshIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function UsersPage({ onCountChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ newName: "", email: "" });

  useEffect(() => {
    fetchUsersList();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
  };

  const fetchUsersList = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      if (onCountChange) onCountChange(data.length);
    } catch (err) {
      console.error(err);
      showFeedback(
        "error",
        "Backend offline — verifique se o servidor está rodando.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showFeedback("error", "Preencha todos os campos.");
      return;
    }
    setSubmitting(true);
    try {
      await createUser(formData);
      showFeedback("success", `${formData.name} adicionado.`);
      setFormData({ name: "", email: "" });
      await fetchUsersList();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Falha ao cadastrar.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setEditFormData({ newName: user.name, email: user.email || "" });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditFormData({ newName: "", email: "" });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.newName.trim() || !editFormData.email.trim()) {
      showFeedback("error", "Campos obrigatórios.");
      return;
    }
    try {
      await updateUser(editingUser.name, {
        newName: editFormData.newName,
        email: editFormData.email,
      });
      showFeedback("success", `Registro atualizado.`);
      setEditingUser(null);
      await fetchUsersList();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Falha ao atualizar.");
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Excluir "${name}"?`)) return;
    try {
      await deleteUser(name);
      showFeedback("success", `${name} removido.`);
      await fetchUsersList();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Falha ao excluir.");
    }
  };

  const filtered = users.filter((u) => {
    const t = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(t) || u.email?.toLowerCase().includes(t)
    );
  });

  return (
    <>
      {feedback.message && (
        <div className={`toast ${feedback.type}`}>{feedback.message}</div>
      )}

      <div className="page-header">
        <h2>Usuários</h2>
        <p>Lista de usuarios cadastrados</p>
      </div>

      {/* Inline form */}
      <section className="form-section">
        <div className="form-section-title">Adicionar registro</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="u-name">Nome</label>
              <input
                id="u-name"
                type="text"
                placeholder="Henrique Paiva"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="u-email">E-mail</label>
              <input
                id="u-email"
                type="email"
                placeholder="henrique@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-accent"
              disabled={submitting}
            >
              {submitting ? "Salvando…" : "Adicionar"}
            </button>
          </div>
        </form>
      </section>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <span className="toolbar-count">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="toolbar-left">
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn-refresh"
            onClick={fetchUsersList}
            title="Recarregar"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-well">
          <div className="loader"></div>
          <p>Carregando dados…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-well">
          <h4>{search ? "Sem resultados" : "Nenhum registro"}</h4>
          <p>
            {search
              ? "Tente outro termo de busca."
              : "Adicione o primeiro usuário acima."}
          </p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>ID</th>
              <th style={{ textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id || user.name}>
                <td className="cell-name">{user.name}</td>
                <td className="cell-email">{user.email}</td>
                <td className="cell-id">{user.id || "—"}</td>
                <td>
                  <div className="cell-actions">
                    <button onClick={() => startEditing(user)} title="Editar">
                      <EditIcon />
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(user.name)}
                      title="Excluir"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit modal */}
      {editingUser && (
        <div className="overlay" onClick={cancelEditing}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-head">
              <h3>Editar usuário</h3>
              <button className="dialog-close" onClick={cancelEditing}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="dialog-body">
                <p className="dialog-context">
                  Editando o registro de <strong>{editingUser.name}</strong>
                </p>
                <div className="field">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={editFormData.newName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        newName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="dialog-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={cancelEditing}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-accent">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
