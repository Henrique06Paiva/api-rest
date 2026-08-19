import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

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

export default function ProductsPage({ onCountChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchProductsList();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3500);
  };

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      if (onCountChange) onCountChange(data.length);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Backend offline — verifique o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericPrice = parseFloat(formData.price);
    if (!formData.name.trim() || isNaN(numericPrice) || numericPrice < 0) {
      showFeedback("error", "Informe um nome e um preço válidos.");
      return;
    }
    setSubmitting(true);
    try {
      await createProduct({ name: formData.name.trim(), price: numericPrice });
      showFeedback("success", `${formData.name} adicionado ao catálogo.`);
      setFormData({ name: "", price: "" });
      await fetchProductsList();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Falha ao cadastrar.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setEditPrice(product.price !== undefined ? String(product.price) : "");
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditPrice("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const numericPrice = parseFloat(editPrice);
    if (isNaN(numericPrice) || numericPrice < 0) {
      showFeedback("error", "Preço inválido.");
      return;
    }
    try {
      await updateProduct(editingProduct.name, { price: numericPrice });
      showFeedback("success", `Preço atualizado.`);
      setEditingProduct(null);
      await fetchProductsList();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Falha ao atualizar.");
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Excluir "${name}"?`)) return;
    try {
      await deleteProduct(name);
      showFeedback("success", `${name} removido.`);
      await fetchProductsList();
    } catch (err) {
      console.error(err);
      showFeedback("error", "Falha ao excluir.");
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const formatBRL = (value) =>
    typeof value === "number"
      ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : `R$ ${value}`;

  return (
    <>
      {feedback.message && (
        <div className={`toast ${feedback.type}`}>{feedback.message}</div>
      )}

      <div className="page-header">
        <h2>Produtos</h2>
        <p>Catálogo de itens com preços gerenciados via Firestore.</p>
      </div>

      {/* Inline form */}
      <section className="form-section">
        <div className="form-section-title">Novo item</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="p-name">Produto</label>
              <input
                id="p-name"
                type="text"
                placeholder="Teclado Mecânico"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="field">
              <label htmlFor="p-price">Preço (R$)</label>
              <input
                id="p-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="249.90"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
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
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
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
            onClick={fetchProductsList}
            title="Recarregar"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      {/* Catalog grid */}
      {loading ? (
        <div className="loading-well">
          <div className="loader"></div>
          <p>Carregando catálogo…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-well">
          <h4>{search ? "Sem resultados" : "Catálogo vazio"}</h4>
          <p>
            {search
              ? "Tente outro termo."
              : "Adicione o primeiro produto acima."}
          </p>
        </div>
      ) : (
        <div className="catalog-grid">
          {filtered.map((product) => (
            <div className="catalog-item" key={product.id || product.name}>
              <div className="catalog-item-label">Produto</div>
              <div className="catalog-item-name">{product.name}</div>
              <div className="catalog-item-price">
                {formatBRL(product.price)}
              </div>
              <div className="catalog-item-id">{product.id || "—"}</div>
              <div className="catalog-item-actions">
                <button onClick={() => startEditing(product)}>
                  <EditIcon /> Preço
                </button>
                <button
                  className="danger"
                  onClick={() => handleDelete(product.name)}
                  title="Excluir"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editingProduct && (
        <div className="overlay" onClick={cancelEditing}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-head">
              <h3>Alterar preço</h3>
              <button className="dialog-close" onClick={cancelEditing}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="dialog-body">
                <p className="dialog-context">
                  Atualizando valor para <strong>{editingProduct.name}</strong>
                </p>
                <div className="field">
                  <label>Novo preço (R$)</label>
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
                  Atualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
