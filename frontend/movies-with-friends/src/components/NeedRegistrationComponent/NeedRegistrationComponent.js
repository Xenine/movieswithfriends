import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LOGIN_ROUTE } from '../../utils/consts'
import classes from './NeedRegistrationComponent.module.scss'

const NeedRegistrationComponent = ({ text }) => {
    const navigate = useNavigate()

    const onClick = () => {
        navigate('/' + LOGIN_ROUTE + '/')
    }

    return (
        <div className={classes.container}>
            <div>{text}</div>
            <button className={classes.button} onClick={onClick}>
                Войти
            </button>
        </div>
    )
}

export default NeedRegistrationComponent
