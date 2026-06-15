import './App.css';
import { Routes, Route } from "react-router-dom";

import ProfilePage from './pages/ProfilePage';
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/GroupPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDetailPage from "./pages/UserDetailPage";
import GroupEditPage from "./pages/GroupEditPage";
import ManageMembersPage from "./pages/ManageMembersPage";

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/groups/:id" element={<GroupPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/groups/:id/members" element={<ManageMembersPage />} />
                <Route path="/groups/:id/edit" element={<GroupEditPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
            </Routes>
        </Layout>
    );
}

export default App;