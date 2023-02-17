import {
    Routes,
    Route,
    Navigate,
    useNavigate,
    useLocation,
} from 'react-router-dom'
import { useContext, useEffect } from 'react'
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
import AccountPage from '../views/AccountPage/AccountPage'
import ReviewPage from '../views/ReviewPage/ReviewPage'
import LoginPage from '../views/LoginPage/LoginPage'
import AboutPage from '../views/AboutPage/AboutPage'
import MoviePage from '../views/MoviePage/MoviePage'
import FriendsPage from '../views/FriendsPage/FriendsPage'
import SearchPage from '../views/SearchPage/SearchPage'
import PlayerPage from '../views/PlayerPage/PlayerPage'

const AppRouter = observer(() => {
    const { store } = useContext(Context)
    const navigate = useNavigate()
    const location = useLocation()

    // useEffect(() => {
    //     console.log('We are in AppRouter useEffect')
    //     const userData = JSON.parse(localStorage.getItem('user'))
    //     if (!userData) {
    //         refresh()
    //             .then(() => {
    //                 // user.setUser(JSON.parse(localStorage.getItem('user')))
    //                 // user.setIsAuth(true)
    //             })
    //             .catch((err) => {
    //                 console.log('nav to login page ')
    //                 navigate(LOGIN_ROUTE)
    //             })
    //     } else {
    //         // user.setUser(JSON.parse(localStorage.getItem('user')))
    //         // user.setIsAuth(true)
    //     }
    //     // if (user.isAuth) {
    //     //     console.log('user.isAuth == true')
    //     // }

    //     // setLoading(false)
    // }, [])

    useEffect(() => {
        console.log('обновление страницы1 ')
        console.log(localStorage.getItem('access_token'))
        if (localStorage.getItem('access_token')) {
            console.log('обновление страницы')
            store.refresh()
            // } else if (location.pathname !== `/${LOGIN_ROUTE}`) {
            //     navigate(LOGIN_ROUTE)
            // }
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
                    <Route path={ACCOUNT_ROUTE} element={<AccountPage />} />
                    <Route path={FRIENDS_ROUTE} element={<FriendsPage />} />
                    <Route
                        path={MOVIE_ROUTE + '/:id'}
                        element={<MoviePage />}
                    />
                    <Route path={SEARCH_ROUTE} element={<SearchPage />} />
                    <Route
                        path={REVIEW_ROUTE + '/:id'}
                        element={<ReviewPage />}
                    />
                    <Route path={LOGIN_ROUTE} element={<LoginPage />} />
                    <Route path={ABOUT_ROUTE} element={<AboutPage />} />
                    <Route
                        path={PLAYER_ROUTE + '/:id'}
                        element={<PlayerPage />}
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
