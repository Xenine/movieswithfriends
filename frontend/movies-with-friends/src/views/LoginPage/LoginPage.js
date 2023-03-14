import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { HOME_ROUTE } from '../../utils/consts'
import classes from './LoginPage.module.scss'

const LoginPage = observer(() => {
    const { store } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        window.onTelegramAuth = (userData) => {
            store.login(userData)
            navigate(HOME_ROUTE)
        }

        const script = document.createElement('script')
        script.src = 'https://telegram.org/js/telegram-widget.js?15'
        script.setAttribute(
            'data-telegram-login',
            process.env.REACT_APP_BOT_NAME
        )
        script.setAttribute('data-size', 'medium')
        script.setAttribute('data-request-access', 'write')
        script.setAttribute('data-userpic', true)
        script.setAttribute('data-onauth', 'onTelegramAuth(user)')
        script.async = true
        document.getElementById('telegram').appendChild(script)
    })

    return (
        <div className="d-flex flex-column text-center">
            <p className={classes.title}>
                Войдите с помощью Telegram{' '}
                <img className={classes.tg} src="/img/telegram.png" alt="tg" />
            </p>
            <p>
                Это легко и быстро. <br /> Telegram предоставит сайту информацию
                о вашем имени, юзернейму, а также фотографию профиля. <br />
                После этого авторизация будет происходить автоматически.
            </p>
            <div>
                <div id="telegram" />
            </div>
        </div>
    )
})

export default LoginPage
