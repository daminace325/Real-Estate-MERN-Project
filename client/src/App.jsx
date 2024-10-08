import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import About from './pages/About'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import UserRoute from './components/UserRoute'

export default function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<AdminRoute />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/profile/:userId" element={<Profile />} />
                </Route>
                <Route element={<UserRoute />}>
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                </Route>
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/listing/:listingId" element={<Listing />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create-listing" element={<CreateListing />} />
                    <Route path="/update-listing/:listingId" element={<UpdateListing />} />
                </Route>
            </Routes>
        </Router>
    )
}

