import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Context } from '../..'
import NeedRegistrationComponent from '../../components/NeedRegistrationComponent/NeedRegistrationComponent'
import StarRating from '../../components/StarRating/StarRating'
import {
    deleteReview,
    fetchMovie,
    patchReview,
    postAddBookmark,
    postRemoveBookmark,
    postReview,
} from '../../http/API'
import { PLAYER_ROUTE, type_choices } from '../../utils/consts'
import classes from './MoviePage.module.scss'

const MoviePage = () => {
    const { store } = useContext(Context)
    const navigate = useNavigate()
    const [movie, setMovie] = useState({})
    const [loading, setLoading] = useState(true)
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)
    const [updateButtonText, setUpdateButtonText] = useState('Обновить')
    const { id } = useParams()

    useEffect(() => {
        fetchMovie(id).then((data) => {
            setMovie(data)
            setReview(data.review?.text ? data.review.text : '')
            setStars(data.review?.rating ? data.review.rating : 0)
            setLoading(false)
        })
    }, [id])

    const playButtonHandle = () => {
        navigate('/' + PLAYER_ROUTE + '/' + movie.kp_id + '/')
    }

    const onSubmitReview = async () => {
        const data = {
            movie: parseInt(id),
            text: review,
            rating: stars,
        }
        postReview(data).then((respose) => {
            setMovie((movie) => ({
                ...movie,
                review: respose.data,
            }))
        })
    }

    const onUpdateReview = async () => {
        const data = {
            text: review,
            rating: stars,
        }
        patchReview(movie.review.id, data)
        setUpdateButtonText('Обновлено!')
        setTimeout(() => {
            setUpdateButtonText('Обновить')
        }, 3000)
    }

    const onDeleteReview = async () => {
        deleteReview(movie.review.id)
        setStars(0)
        setReview('')
        setMovie((movie) => ({
            ...movie,
            review: null,
        }))
    }

    const onAddBookmark = async () => {
        postAddBookmark(id)
        setMovie((movie) => ({
            ...movie,
            is_in_bookmarks: true,
        }))
    }

    const onRemoveBookmark = async () => {
        postRemoveBookmark(id)
        setMovie((movie) => ({
            ...movie,
            is_in_bookmarks: false,
        }))
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
                        src={movie.poster_url}
                        alt="poster"
                    />
                </div>
                <div className={classes.info_block}>
                    <div className={classes.movie_block}>
                        <span className={classes.title}>{movie.name}</span>
                        <br />
                        <span className={classes.alt_title}>
                            {movie.alternative_name}
                        </span>
                        <p>
                            {type_choices[movie.type]} | {movie.year} год
                        </p>

                        <div className="d-flex">
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
                            {store.isAuth &&
                                (movie.is_in_bookmarks ? (
                                    <div
                                        className={classes.bookmark}
                                        onClick={onRemoveBookmark}
                                        title="Убрать из закладок"
                                    >
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/1A1A1A/favorites.png"
                                            alt="bookmark"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={classes.bookmark}
                                        onClick={onAddBookmark}
                                        title="Добавить в закладки"
                                    >
                                        <img
                                            src="https://img.icons8.com/ios/50/141414/favorites.png"
                                            alt="bookmark"
                                        />
                                    </div>
                                ))}
                        </div>
                        <p>{movie.description}</p>
                        <p>
                            {[1, 3].includes(movie.type) ? (
                                <>
                                    Продолжительность фильма:{' '}
                                    {movie.movie_length} мин.
                                </>
                            ) : (
                                <>
                                    Продолжительность серии:{' '}
                                    {movie.movie_length} мин.
                                </>
                            )}
                        </p>
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
                        {store.isAuth ? (
                            movie.review?.rating ? (
                                <>
                                    <button
                                        className={classes.button}
                                        onClick={onUpdateReview}
                                    >
                                        {updateButtonText}
                                    </button>
                                    <button
                                        className={classes.delete_button}
                                        onClick={onDeleteReview}
                                    >
                                        Удалить
                                    </button>
                                </>
                            ) : (
                                <button
                                    className={classes.button}
                                    onClick={onSubmitReview}
                                >
                                    Отправить
                                </button>
                            )
                        ) : (
                            <NeedRegistrationComponent text="Чтобы оставить отзыв зарегистрируйтесь или войдите" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoviePage
