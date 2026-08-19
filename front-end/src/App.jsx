import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import UsersPage from './pages/UsersPage'
import ProductsPage from './pages/ProductsPage'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('users')
  const [usersCount, setUsersCount] = useState(0)
  const [productsCount, setProductsCount] = useState(0)

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        usersCount={usersCount}
        productsCount={productsCount}
      />

      <main className="main-area">
        {activeTab === 'users' ? (
          <UsersPage onCountChange={setUsersCount} />
        ) : (
          <ProductsPage onCountChange={setProductsCount} />
        )}
      </main>
    </div>
  )
}
