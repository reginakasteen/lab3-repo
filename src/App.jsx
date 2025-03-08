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
import MessagesHistory from './views/MessagesHistory.jsx'
import Search from './views/Search.jsx'
import Profile from './views/Profile.jsx'
import UserProfilePage from './views/UserProfilePage.jsx'



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
            <Route element={<UserProfilePage/>} path="/user/:id" exact/>
            <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/todo" element={<Todo />} />
                <Route path="/inbox" element={<Message />} />
                <Route path="/inbox/:id" element={<MessagesHistory />} />
                <Route path="/search/:username" element={<Search />} />
            </Route>
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
      
    </>
  )
}

export default App
