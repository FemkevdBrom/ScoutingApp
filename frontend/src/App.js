import './App.css';
import { Routes, Route } from "react-router-dom";

import ProfilePage from './pages/ProfilePage';
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/GroupPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/groups/:id" element={<GroupPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Layout>
    );
}

export default App;