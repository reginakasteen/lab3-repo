import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import Homepage from './views/Homepage.jsx'
import Register from './views/Register'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import Navbar from './views/Navbar'
import Footer from './views/Footer.jsx'
import Todo from './views/Todo.jsx'
import Message from './views/Message.jsx'



function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            
            <Route element={<Login/>} path="/login" exact/>
            <Route element={<Register/>} path="/register" exact/>
            <Route element={<Homepage/>} path="/" exact/>
            <Route path="/dashboard" element={<PrivateRoute />}>
                <Route index element={<Dashboard />} />
            </Route>
            <Route path="/todo" element={<PrivateRoute />}>
                <Route index element={<Todo />} />
            </Route>
            <Route path="/inbox" element={<PrivateRoute />}>
                <Route index element={<Message />} />
            </Route>
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
      
    </>
  )
}

export default App
