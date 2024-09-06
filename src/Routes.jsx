import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
    { basename: import.meta.env.DEV ? "/" : "/siiiift/" },
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/profile",
        element: <ProfileView />,
    },
    {
        path: "/profile/following",
        element: <FollowersView />,
    },
    {
        path: "/profile/followers",
        element: <FollowersView />,
    },
    {
        path: "/profile/settings",
        element: <SettingsManagementView />,
    },
    {
        path: "/profile/settings/follow-requests",
        element: <FollowRequestView />,
    },
    {
        path: "/userid/recipeid",
        element: <BakeHistoryView />,
    },
    {
        path: "/postyourbake",
        element: <PostYourBakeView />,
    },
    {
        path: "/recipeid",
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
        element: <LoginView />,
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