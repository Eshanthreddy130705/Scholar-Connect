import {useState} from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import LoginPage from './components/LoginPage'; 
import RegisterPage from './components/RegisterPage';
import ScholarshipDetailPage from './components/ScholarshipdetailPage'
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar/Navbar';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/scholarship/:id" element={<ScholarshipDetailPage />} />
      </Routes>
    </BrowserRouter>
    </div>
    
  )
}

export default App
