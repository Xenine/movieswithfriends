import { useNavigate } from 'react-router-dom'
import { MOVIE_ROUTE } from '../../utils/consts'
import classes from './SearchMovieCard.module.scss'

const SearcMovieCard = ({ movie }) => {
    const navigate = useNavigate()
    const onClick = () => {
        navigate('/' + MOVIE_ROUTE + '/' + movie.id)
    }
    const raiting = Math.floor(parseFloat(movie.kp_rating) * 10) / 10

    const type_choices = {
        1: 'Фильм',
        2: 'Сериал',
        3: 'Мультик',
        4: 'Аниме',
        5: 'Мульт-сериал',
        6: 'ТВ-шоу',
    }

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

export default SearcMovieCard
