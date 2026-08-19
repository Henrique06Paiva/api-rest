import React, { useState } from 'react'
import Navbar from './components/Navbar'
import UsersPage from './pages/UsersPage'
import ProductsPage from './pages/ProductsPage'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('users')
  const [usersCount, setUsersCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        usersCount={usersCount}
        productsCount={productsCount}
      />

      <main className="main-content">
        {activeTab === 'users' ? (
          <UsersPage onCountChange={setUsersCount} />
        ) : (
          <ProductsPage onCountChange={setProductsCount} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          ⚡ Conectado à API REST: <code>http://localhost:3000</code> &bull; Banco de Dados: Firestore
        </p>
      </footer>
    </div>
  )
}
