import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ACCOUNT_ROUTE, MOVIE_ROUTE } from '../../utils/consts'
import classes from './ReviewCard.module.scss'

const ReviewCard = ({ movie, author, text, rating }) => {
    const navigate = useNavigate()

    const ratingRef = useRef()

    useEffect(() => {
        if (parseInt(rating) < 5) {
            ratingRef.current.style.backgroundColor = 'rgba(255, 191, 191)'
        } else if (parseInt(rating) < 8) {
            ratingRef.current.style.backgroundColor = 'rgba(245, 231, 176)'
        } else {
            ratingRef.current.style.backgroundColor = 'rgba(184, 227, 184)'
        }
    }, [rating])

    const onMovieClick = () => {
        navigate('/' + MOVIE_ROUTE + '/' + movie.id)
    }

    const onAvatarClick = () => {
        navigate('/' + ACCOUNT_ROUTE + '/' + author.id)
    }

    return (
        <div className={classes.card}>
            <div ref={ratingRef} className={classes.hover_card}>
                <div className={classes.card_inside}>
                    <div className={classes.info}>
                        <div className={classes.title}>{movie.name}</div>
                        <div className={classes.author}>
                            <div
                                onClick={onAvatarClick}
                                className={classes.hover}
                            >
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
                    <div onClick={onMovieClick} className={classes.hover}>
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

export default ReviewCard
