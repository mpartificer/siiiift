import { createHashRouter, Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext.jsx"  // Make sure path is correct
import HomeView from "./components/HomeView.jsx"
import ProfileView from "./components/ProfileView.jsx"
import FollowersView from "./components/FollowersView.jsx"
import BakeHistoryView from "./components/BakeHistoryView.jsx"
import PostYourBakeView from "./components/PostYourBakeView.jsx"
import RecipeView from "./components/RecipeView.jsx"
import SearchView from "./components/SearchView.jsx"
import RecipeBoxView from "./components/RecipeBoxView.jsx"
import LogInView from "./components/LogInView.jsx"
import ForgotPasswordView from "./components/ForgotPasswordView.jsx"
import SignUpView from "./components/SignUpView.jsx"
import WebsiteRetrievalView from "./components/WebsiteRetrievalView.jsx"
import SettingsManagementView from "./components/SettingsManagementView.jsx"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

const router = createHashRouter([
    {
        path: "/",
        element: <ProtectedRoute><HomeView /></ProtectedRoute>,
    },
    {
        path: `/profile/:username`,
        element: <ProtectedRoute><ProfileView /></ProtectedRoute>,
    },
    {
        path: `/profile/:username/following`,
        element: <ProtectedRoute><FollowersView /></ProtectedRoute>,
    },
    {
        path: `/profile/:username/followers`,
        element: <ProtectedRoute><FollowersView /></ProtectedRoute>,
    },
    {
        path: "/profile/settings",
        element: <ProtectedRoute><SettingsManagementView /></ProtectedRoute>,
    },
    {
        path: `/:username/:recipeid`,
        element: <ProtectedRoute><BakeHistoryView /></ProtectedRoute>,
    },
    {
        path: "/postyourbake",
        element: <ProtectedRoute><PostYourBakeView /></ProtectedRoute>,
    },
    {
        path: `/recipe/:recipeid`,
        element: <ProtectedRoute><RecipeView /></ProtectedRoute>,
    },
    {
        path: "/search",
        element: <ProtectedRoute><SearchView /></ProtectedRoute>,
    },
    {
        path: "/recipebox",
        element: <ProtectedRoute><RecipeBoxView /></ProtectedRoute>,
    },
    {
        path: "/login",
        element: <LogInView />,
    },
    {
        path: "/login/forgot-password",
        element: <ForgotPasswordView />,
    },
    {
        path: "/signup",
        element: <SignUpView />,
    },
    {
        path: "/reciperetriever",
        element: <ProtectedRoute><WebsiteRetrievalView /></ProtectedRoute>,
    }
], {
    basename: "/"
})

export default router