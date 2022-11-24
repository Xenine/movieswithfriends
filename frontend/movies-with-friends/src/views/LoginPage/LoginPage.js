import React, { useEffect } from "react";
// import { Redirect, useLocation } from 'react-router-dom';
import { sendHash } from '../../helpers/user/user';
import classes from './LoginPage.module.css';

function LoginPage() {

  // const location = useLocation();
  // const dispatch = useDispatch();
  // const user = useSelector((state) => state.user.user);
  const user = 10;

  useEffect(() => {

    window.onTelegramAuth = async (userData) => {
      await sendHash(userData);
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
    }

    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?15";
    script.setAttribute('data-telegram-login', process.env.REACT_APP_BOT_NAME);
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-request-access', 'write');
    // script.setAttribute('data-userpic', true);
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;
    //создается кнопка для авторизации через телеграм
    // const script = btnConstructor(setJoined);
    document.getElementById('telegram').appendChild(script)
  });

  return (
    <div>
      {/* {
        user && <Redirect to={location.state?.from || '/'} />
      } */}
      <b className={classes.title}> Вход в Reminder-bot </b>
      <div className={classes.loginBlock}>
        <div id="telegram" />
      </div>
    </div>
  );
}

export default LoginPage;