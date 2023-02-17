import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { HOME_ROUTE } from '../../utils/consts'
import classes from './LoginPage.module.css'

const LoginPage = observer(() => {
    const { store } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        window.onTelegramAuth = (userData) => {
            store.login(userData)
            console.log('Nav to /')
            navigate(HOME_ROUTE)

            // fetchChats().catch((e) => {
            //   dispatch(
            //     appActions.addNotification({
            //       title: 'Не получилось загрузить список чатов',
            //       status: 'error',
            //     })
            //   );
            // });
            // window.localStorage.setItem('user', JSON.stringify(userData));
            // dispatch(userActions.setUser(userData));

            // data = getMe(userData.id).then(data => {
            //   console.log(userData);
            //   console.log(data);
            //   localStorage.setItem('user', JSON.stringify(data));
            //   user.setIsAuth(true);
            //   user.setUser(data);

            //   navigate(HOME_ROUTE);
            // }
            // )
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
        //создается кнопка для авторизации через телеграм
        // const script = btnConstructor(setJoined);
        document.getElementById('telegram').appendChild(script)
    })

    return (
        <div>
            {/* {
        user && <Redirect to={location.state?.from || '/'} />
      } */}
            <b className={classes.title}> Вход в Movies with Friends </b>
            <div className={classes.loginBlock}>
                <div id="telegram" />
            </div>
        </div>
    )
})

export default LoginPage
