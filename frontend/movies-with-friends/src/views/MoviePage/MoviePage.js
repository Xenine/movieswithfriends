import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StarRating from '../../components/StarRating/StarRating'
import { fetchMovie, postReview } from '../../http/API'
import { PLAYER_ROUTE } from '../../utils/consts'
import classes from './MoviePage.module.scss'

const MoviePage = () => {
    const navigate = useNavigate()
    const [movie, setMovie] = useState({})
    const [loading, setLoading] = useState(true)
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)
    const { id } = useParams()

    useEffect(() => {
        fetchMovie(id).then((data) => {
            setMovie(data)
            setLoading(false)
        })
    }, [id])

    const playButtonHandle = () => {
        navigate('/' + PLAYER_ROUTE + '/' + movie.kp_id)
    }

    const onSubmit = async () => {
        const data = {
            movie: parseInt(id),
            text: review,
            rating: stars,
        }
        postReview(data)
    }

    if (loading) {
        return <div> Loading... </div>
    }

    return (
        <div>
            <div className={classes.root_block}>
                <div className="mt-5">
                    <img
                        className="cardAvatar"
                        width={280}
                        hight={280}
                        src={movie.poster_url}
                        alt="avatar"
                    />
                </div>
                <div className={classes.info_block}>
                    <div className={classes.movie_block}>
                        <span className={classes.title}>{movie.name}</span>
                        <br />
                        <span className={classes.alt_title}>
                            {movie.alternative_name}
                        </span>
                        <p>{movie.year}</p>
                        <div
                            className={classes.play_button}
                            onClick={playButtonHandle}
                        >
                            <img
                                alt="play"
                                src="https://img.icons8.com/metro/52/FFFFFF/play.png"
                            />
                            Смотреть
                        </div>
                        <p>{movie.description}</p>
                    </div>
                    <div className={classes.ratings}>
                        <div
                            className={classes.rating}
                            onClick={() =>
                                window.open(
                                    `https://www.imdb.com/title/${movie.imdb_id}/`,
                                    '_blank'
                                )
                            }
                        >
                            <div>
                                <img
                                    width={48}
                                    height={48}
                                    src="https://img.icons8.com/color/48/null/imdb.png"
                                    alt="imdb"
                                />
                            </div>
                            <div className={classes.rating_number}>
                                <span className={classes.title}>
                                    {Math.floor(
                                        parseFloat(movie.imdb_rating) * 10
                                    ) / 10}
                                </span>
                            </div>
                        </div>
                        <div
                            className={classes.rating}
                            onClick={() =>
                                window.open(
                                    `https://www.kinopoisk.ru/film/${movie.kp_id}/`,
                                    '_blank'
                                )
                            }
                        >
                            <div>
                                <img
                                    width={38}
                                    height={38}
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Kinopoisk_colored_square_icon.svg/202px-Kinopoisk_colored_square_icon.svg.png?20211227181504"
                                    alt="kp"
                                />
                            </div>
                            <div className={classes.rating_number}>
                                <span className={classes.title}>
                                    {Math.floor(
                                        parseFloat(movie.kp_rating) * 10
                                    ) / 10}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="mt-50">
                    <div className="d-flex justify-center">
                        <StarRating stars={stars} setStars={setStars} />
                    </div>
                    <div className="mt-40 d-flex justify-center">
                        <textarea
                            className={classes.textarea}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Напишите пару слов о фильме..."
                        />
                    </div>
                    <div className="mt-20 d-flex justify-center">
                        <button className={classes.button} onClick={onSubmit}>
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoviePage
