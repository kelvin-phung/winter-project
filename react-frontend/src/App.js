import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ViewEntries from './pages/ViewEntries'
import NewEntry from './pages/NewEntry'
import EditEntry from './pages/EditEntry'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/entries' element={<ViewEntries />} />
        <Route path='/new-entry' element={<NewEntry />} />
        <Route path='/edit-entry/:id' element={<EditEntry />} />
      </Routes>
    </BrowserRouter>
  )
}
