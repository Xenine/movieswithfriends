import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MOVIE_ROUTE } from '../../../utils/consts'
import classes from './CarouselCard.module.scss'

const CarouselCard = ({ movie }) => {
    const navigate = useNavigate()
    const onClick = () => {
        navigate('/' + MOVIE_ROUTE + '/' + movie.id)
    }
    return (
        <div className={classes.card}>
            <div onClick={onClick} className={classes.img}>
                <img
                    src={movie.poster_url}
                    alt="poster"
                    width={156}
                    height={234}
                />
            </div>
            <div className={classes.title_wrapper}>
                <span className={classes.title}>{movie.name}</span>
            </div>
        </div>
    )
}

export default CarouselCard
