import { createBrowserRouter } from "react-router-dom"
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



const router = createBrowserRouter([
    { basename: import.meta.env.DEV ? "/" : "/siiiift/" },
    {
        path: "/",
        element: <HomeView />,
    },
    {
        path: `/profile/:username`,
        element: <ProfileView />,
    },
    {
        path: `/profile/:username/following`,
        element: <FollowersView />,
    },
    {
        path: `/profile/:username/followers`,
        element: <FollowersView />,
    },
    {
        path: "/profile/settings",
        element: <SettingsManagementView />,
    },
    {
        path: `/:username/:recipeid`,
        element: <BakeHistoryView />,
    },
    {
        path: "/postyourbake",
        element: <PostYourBakeView />,
    },
    {
        path: `/recipe/:recipeid`,
        element: <RecipeView />,
    },
    {
        path: "/search",
        element: <SearchView />,
    },
    {
        path: "/recipebox",
        element: <RecipeBoxView />,
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
        element: <WebsiteRetrievalView />,
    }
])

export default router