import {
    ABOUT_ROUTE,
    ACCOUNT_ROUTE,
    HOME_ROUTE,
    LOGIN_ROUTE,
    MOVIE_ROUTE,
    REVIEW_ROUTE,
} from './utils/consts'
import AboutPage from './views/AboutPage/AboutPage'
import AccountPage from './views/AccountPage/AccountPage'
import HomePage from './views/HomePage/HomePage'
import LoginPage from './views/LoginPage/LoginPage'
import MoviePage from './views/MoviePage/MoviePage'
import ReviewPage from './views/ReviewPage/ReviewPage'

export const authRoutes = [
    {
        path: HOME_ROUTE,
        Component: <HomePage />,
    },
    {
        path: ACCOUNT_ROUTE,
        Component: <AccountPage />,
    },
    {
        path: MOVIE_ROUTE + '/:id',
        Component: <MoviePage />,
    },
    {
        path: REVIEW_ROUTE + '/:id',
        Component: <ReviewPage />,
    },
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: <LoginPage />,
    },
    {
        path: ABOUT_ROUTE,
        Component: <AboutPage />,
    },
]
