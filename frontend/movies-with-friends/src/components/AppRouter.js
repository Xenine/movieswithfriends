import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '..'
import {
    ABOUT_ROUTE,
    ACCOUNT_ROUTE,
    FRIENDS_ROUTE,
    HOME_ROUTE,
    LOGIN_ROUTE,
    MOVIE_ROUTE,
    PLAYER_ROUTE,
    REVIEW_ROUTE,
    SEARCH_ROUTE,
} from '../utils/consts'
import Layout from './Layout/Layout'
import HomePage from '../views/HomePage/HomePage'
// import AccountPage from '../views/AccountPage/AccountPage'
// import ReviewPage from '../views/ReviewPage/ReviewPage'
// import LoginPage from '../views/LoginPage/LoginPage'
// import AboutPage from '../views/AboutPage/AboutPage'
// import MoviePage from '../views/MoviePage/MoviePage'
// import FriendsPage from '../views/FriendsPage/FriendsPage'
// import SearchPage from '../views/SearchPage/SearchPage'
// import PlayerPage from '../views/PlayerPage/PlayerPage'

const AccountPage = lazy(() => import('../views/AccountPage/AccountPage'))
const ReviewPage = lazy(() => import('../views/ReviewPage/ReviewPage'))
const LoginPage = lazy(() => import('../views/LoginPage/LoginPage'))
const AboutPage = lazy(() => import('../views/AboutPage/AboutPage'))
const MoviePage = lazy(() => import('../views/MoviePage/MoviePage'))
const FriendsPage = lazy(() => import('../views/FriendsPage/FriendsPage'))
const SearchPage = lazy(() => import('../views/SearchPage/SearchPage'))
const PlayerPage = lazy(() => import('../views/PlayerPage/PlayerPage'))

const AppRouter = observer(() => {
    const { store } = useContext(Context)

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            store.refresh()
        }
    }, [])

    if (store.isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div style={{ height: '100%' }}>
            <Routes>
                <Route path={HOME_ROUTE} element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route
                        path={ACCOUNT_ROUTE + '/:id'}
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <AccountPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path={FRIENDS_ROUTE}
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <FriendsPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path={MOVIE_ROUTE + '/:id'}
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <MoviePage />
                            </Suspense>
                        }
                    />
                    <Route
                        path={SEARCH_ROUTE}
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <SearchPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path={REVIEW_ROUTE + '/:id'}
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <ReviewPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path={LOGIN_ROUTE}
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <LoginPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path={ABOUT_ROUTE}
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <AboutPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path={PLAYER_ROUTE + '/:id'}
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <PlayerPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="*"
                        element={<Navigate to={HOME_ROUTE} replace />}
                    />
                </Route>
            </Routes>
        </div>
    )
})

export default AppRouter
