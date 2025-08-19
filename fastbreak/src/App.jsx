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
import BasicStats from "./pages/stats/BasicStats.jsx";
import ShootingStats from "./pages/stats/ShootingStats.jsx";
import Profile from "./pages/settings/profile.jsx";
import ProfileList from "./pages/playerProfiles/ProfileList.jsx";
import PlayerProfile from "./pages/playerProfiles/PlayerProfile.jsx";
import FilmRoomHome from "./pages/filmRoom/FilmRoomHome.jsx";
import AddGame from "./pages/filmRoom/AddGame.jsx";
import EditGame from "./pages/filmRoom/EditGame.jsx";
import ViewGame from "./pages/filmRoom/ViewGame.jsx";

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
                <Route path = "/stats/basic/:teamId" element = {<BasicStats/>}/>
                <Route path = "/stats/shooting/:teamId" element = {<ShootingStats/>}/>
                <Route path = "/profile" element={<Profile/>}/>
                <Route path = "/player-profile/team/:teamId" element={<ProfileList/>}/>
                <Route path = "/player-profile/player/:teamId/:userId" element={<PlayerProfile/>}/>
                <Route path = "/film-room/team/:teamId" element={<FilmRoomHome/>}/>
                <Route path = "film-room/add-game/:teamId" element={<AddGame/>}/>
                <Route path = "film-room/game/edit-game/:teamId/:gameId" element={<EditGame/>}/>
                <Route path = "/film-room/game/view-game/:teamId/:gameId" element={<ViewGame/>}/>
            </Routes>
        </AppLayout>
    );
}

export default App;
