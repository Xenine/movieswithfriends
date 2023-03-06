import { useNavigate } from 'react-router-dom'
import { MOVIE_ROUTE, type_choices } from '../../utils/consts'
import classes from './MovieCard.module.scss'

const MovieCard = ({ movie }) => {
    const navigate = useNavigate()
    const onClick = () => {
        navigate('/' + MOVIE_ROUTE + '/' + movie.id)
    }
    const raiting = Math.floor(parseFloat(movie.kp_rating) * 10) / 10

    return (
        <div onClick={onClick} className={classes.wrapper}>
            <div className="mr-10">
                <img
                    width={80}
                    height={120}
                    src={movie.poster_url}
                    alt="avatar"
                />
            </div>
            <div className="d-flex flex-column align-center justify-center w100p">
                <div className="w100p text-center">
                    {movie.name} <hr />
                </div>

                <div className="d-flex align-center w100p">
                    <div className={classes.types}>
                        <div>{movie.year}</div>
                        <div>{type_choices[movie.type]}</div>
                    </div>
                    <div className={classes.raiting}>{raiting}</div>
                </div>
            </div>
        </div>
    )
}

export default MovieCard
