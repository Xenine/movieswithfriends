import { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import './Navbar.css'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import {
    ABOUT_ROUTE,
    ACCOUNT_ROUTE,
    FRIENDS_ROUTE,
    HOME_ROUTE,
    LOGIN_ROUTE,
    SEARCH_ROUTE,
} from '../../utils/consts'

const Navbar = observer(() => {
    const { store } = useContext(Context)

    const navRef = useRef()

    const showNavBar = () => {
        navRef.current.classList.toggle('responsive_nav')
    }

    const logout = async () => {
        showNavBar()
        await store.logout()
    }

    return (
        <header>
            <div className="nav-wrapper">
                <div>
                    <img width={42} height={42} src="/logo.svg" alt="logo" />
                    <div className="ml-10 flex-column">
                        <span className="nav-title">
                            <span>F</span>ilm<span>F</span>riends.online
                        </span>
                        <span className="nav-subtitle">
                            Смотри, оценивай, делись!
                        </span>
                    </div>
                </div>
                <div>
                    <button className="nav-btn" onClick={showNavBar}>
                        <FaBars />
                    </button>
                    <div>
                        {store.isAuth ? (
                            <nav ref={navRef}>
                                <button
                                    className="nav-btn nav-close-btn"
                                    onClick={showNavBar}
                                >
                                    <FaTimes />
                                </button>

                                <Link to={HOME_ROUTE} onClick={showNavBar}>
                                    Лента
                                </Link>
                                <Link to={SEARCH_ROUTE} onClick={showNavBar}>
                                    Найти фильм
                                </Link>
                                <Link to={FRIENDS_ROUTE} onClick={showNavBar}>
                                    Друзья
                                </Link>
                                <Link to={ABOUT_ROUTE} onClick={showNavBar}>
                                    О сайте
                                </Link>
                                <Link onClick={logout} to={LOGIN_ROUTE}>
                                    Выйти
                                </Link>
                                <Link
                                    to={ACCOUNT_ROUTE + '/' + store.user.id}
                                    onClick={showNavBar}
                                >
                                    <img
                                        width={54}
                                        height={54}
                                        src={
                                            store.user.avatar_url
                                                ? store.user.avatar_url
                                                : '/img/account.svg'
                                        }
                                        alt="account"
                                    />
                                </Link>
                            </nav>
                        ) : (
                            <nav ref={navRef}>
                                <button
                                    className="nav-btn nav-close-btn"
                                    onClick={showNavBar}
                                >
                                    <FaTimes />
                                </button>
                                <Link to={HOME_ROUTE} onClick={showNavBar}>
                                    Лента
                                </Link>
                                <Link to={SEARCH_ROUTE} onClick={showNavBar}>
                                    Найти фильм
                                </Link>
                                <Link to={ABOUT_ROUTE} onClick={showNavBar}>
                                    О сайте
                                </Link>
                                <Link to={LOGIN_ROUTE} onClick={showNavBar}>
                                    Войти
                                </Link>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
})

export default Navbar
