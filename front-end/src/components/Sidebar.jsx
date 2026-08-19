import React from 'react'

// SVG icons as small inline components — no emoji
const UsersIcon = () => (
  <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const BoxIcon = () => (
  <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

export default function Sidebar({ activeTab, setActiveTab, usersCount, productsCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>REST<br />Manager</h1>
        <small>api &middot; firestore</small>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <UsersIcon />
          <span>Usuários</span>
          <span className="link-count">{usersCount}</span>
        </button>

        <button
          className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <BoxIcon />
          <span>Produtos</span>
          <span className="link-count">{productsCount}</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot"></span>
          <span>localhost:3000</span>
        </div>
      </div>
    </aside>
  )
}
