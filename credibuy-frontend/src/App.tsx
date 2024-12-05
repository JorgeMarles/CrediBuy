import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './services/AuthContext'
import Login from './views/Login'
import DashboardLayout from './components/DashboardLayout'
import Products from './views/Products'
import Clients from './views/Clients'
import NewClient from './views/NewClient'
import Credits from './views/Credits'
import CreditDetail from './views/CreditDetail'
import NewCredit from './views/NewCredit'

const App = () => {
  return (<>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute element={<DashboardLayout />} />} >
            <Route path='products' element={<ProtectedRoute element={<Products />} />} />
            <Route path='clients' element={<ProtectedRoute element={<Clients />} />} />
            <Route path='clients/new' element={<ProtectedRoute element={<NewClient />} />} />
            <Route path='credits' element={<ProtectedRoute element={<Credits />} />} />
            <Route path='credits/new' element={<ProtectedRoute element={<NewCredit />} />} />
            <Route path='credits/:id' element={<ProtectedRoute element={<CreditDetail />} />} />
          </Route>
          {/* Add other routes here */}
        </Routes>
      </Router>
    </AuthProvider></>)
}

export default App
