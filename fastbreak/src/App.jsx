import { Routes, Route } from 'react-router-dom';
import Home from './pages/landing/Home.jsx';
import './index.css'
import About from "./pages/landing/about.jsx";
import Contact from "./pages/landing/contact.jsx"
import Login from "./pages/landing/login.jsx"
import Register from "./pages/landing/Register.jsx"
import PrivacyPolicy from "./pages/landing/PrivacyPolicy.jsx";
import Tos from "./pages/landing/Tos.jsx";
import AppLayout from "./AppLayout.jsx";
import Teams from "./pages/teams/teams.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import AddTeam from "./pages/teams/addTeam.jsx";

function App() {
    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About/>} />
                <Route path="/contact" element = {<Contact/>}/>
                <Route path = "/login" element = {<Login/>} />
                <Route path = "/register" element = {<Register/>}/>
                <Route path = "/privacy-policy" element={<PrivacyPolicy/>}/>
                <Route path = "/terms-of-service" element={<Tos/>}/>
                <Route path ="/teams" element = {<Teams/>}/>
                <Route path="/dashboard/team/:teamId" element = {<Dashboard/>}/>
                <Route path = "/add-team" element = {<AddTeam/>}/>
            </Routes>
        </AppLayout>
    );
}

export default App;
