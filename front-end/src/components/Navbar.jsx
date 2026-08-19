import React from 'react'

export default function Navbar({ activeTab, setActiveTab, usersCount, productsCount }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="brand-logo">⚡</div>
          <div className="brand-text">
            <h2>REST Manager Hub</h2>
            <span className="brand-badge">Firebase Firestore API</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="tab-icon">👥</span>
            <span>Usuários</span>
            <span className="tab-count">{usersCount}</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="tab-icon">📦</span>
            <span>Produtos</span>
            <span className="tab-count">{productsCount}</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
