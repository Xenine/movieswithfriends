import React from 'react'
import classes from './AboutPage.module.scss'

const AboutPage = () => {
    return (
        <div className="d-flex flex-column justify-center text-center align-center mb-20">
            <p className="">
                Добро пожаловать на сайт FilmFriends.online! <br />
                Здесь вы можете смотреть фильмы, оставлять отзывы и быть в курсе
                того, что смотрят ваши друзья. <br />
                Поддержать проект можно по qr-коду (или по{' '}
                <span className={classes.ref}>клику</span>):
            </p>
            <div
                className={classes.qr}
                onClick={() =>
                    window.open('https://pay.mysbertips.ru/38482401', '_blank')
                }
            >
                <img src="/img/qr.png" alt="qr" width={200} height={200} />
            </div>
            <p>
                P.S. доступ к просмотру предоставляет сторонний плеер, также как
                и рекламу внутри плеера :) <br />
                При возникновении каких-либо проблем или ошибок, а также с
                предложениями обращайтесь в тг @ivanmyazin
            </p>
        </div>
    )
}

export default AboutPage
