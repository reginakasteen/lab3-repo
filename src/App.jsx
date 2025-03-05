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
            <Route path="/profile" element={<PrivateRoute />}>
                <Route index element={<Profile />} />
            </Route>
            <Route path="/todo" element={<PrivateRoute />}>
                <Route index element={<Todo />} />
            </Route>
            <Route path="/inbox" element={<PrivateRoute />}>
                <Route index element={<Message />} />
            </Route>
            <Route path="/inbox/:id" element={<PrivateRoute />}>
                <Route index element={<MessagesHistory />} />
            </Route>
            <Route path="/search/:username" element={<PrivateRoute />}>
                <Route index element={<Search />} />
            </Route>
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
      
    </>
  )
}

export default App
