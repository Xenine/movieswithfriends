import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOVIE_ROUTE } from '../../utils/consts'
import classes from './MovieCard.module.scss'

const MovieCard = ({ movie, author, text, rating }) => {
    const navigate = useNavigate()

    const ratingRef = useRef()

    useEffect(() => {
        console.log('useEffect in movie card')
        if (parseInt(rating) < 5) {
            ratingRef.current.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'
        } else if (parseInt(rating) < 8) {
            ratingRef.current.style.backgroundColor = 'rgba(255, 204, 0, 0.3)'
        } else {
            ratingRef.current.style.backgroundColor = 'rgba(51, 204, 102, 0.3)'
        }
    }, [rating])

    const onClick = () => {
        navigate(MOVIE_ROUTE + '/' + movie.id)
    }

    return (
        <div onClick={onClick} className={classes.card}>
            <div ref={ratingRef} className={classes.hover_card}>
                <div className={classes.card_inside}>
                    <div className={classes.info}>
                        <div className={classes.title}>{movie.name}</div>
                        <div className={classes.author}>
                            <div>
                                <img
                                    className={classes.avatar}
                                    width={80}
                                    height={80}
                                    src={
                                        author.avatar_url
                                            ? author.avatar_url
                                            : '/img/account.svg'
                                    }
                                    alt="avatar"
                                />
                            </div>
                            <div className={classes.name}>
                                <div>
                                    {author.first_name} {author.second_name}
                                </div>
                                <div className="d-flex align-center mt-10">
                                    <div className={classes.rating}>
                                        {rating}{' '}
                                    </div>
                                    <div>
                                        <img
                                            className={classes.star_img}
                                            src="https://img.icons8.com/ios-glyphs/22/null/star--v1.png"
                                            alt="star"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img
                            width={112}
                            height={168}
                            src={movie.poster_url}
                            alt="poster"
                            className="mt-10 mr-10"
                        />
                    </div>
                </div>

                <div className={classes.text}>
                    <hr className={classes.hr} />
                    {text}
                </div>
            </div>
        </div>
    )
}

export default MovieCard
