import React, { useEffect, useState } from 'react'
import {
    fetchRecomendedMovies,
    fetchReviews,
    fetchTopMovies,
} from '../../http/API'
import classes from './HomePage.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import Carousel from '../../components/Carousel/Carousel'
import ReviewCard from '../../components/ReviewCard/ReviewCard'

const HomePage = () => {
    const [reviews, setReviews] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const limit = 10

    const [topMovies, setTopMovies] = useState([])
    const [recomendedMovies, setRecomendedMovies] = useState([])

    useEffect(() => {
        fetchReviews().then((response) => {
            setHasMore(!!response.data.next)
            setReviews(response.data.results)
        })
        fetchTopMovies().then((response) => {
            setTopMovies(response.data)
        })
        fetchRecomendedMovies().then((response) => {
            setRecomendedMovies(response.data)
        })
    }, [])

    const fetchMoreReviews = () => {
        const offset = reviews.length
        fetchReviews(limit, offset).then((response) => {
            setHasMore(!!response.data.next)
            setReviews([...reviews].concat(response.data.results))
        })
    }

    return (
        <div className="content">
            <p className={classes.subtitle}>Популярные тайтлы {'>'}</p>
            {topMovies.length !== 0 && recomendedMovies.length !== 0 && (
                <div className={classes.suggestions}>
                    <Carousel movies={topMovies}></Carousel>
                </div>
            )}
            <p className={classes.subtitle}>Что посмотреть сегодня {'>'}</p>
            {recomendedMovies.length !== 0 && topMovies.length !== 0 && (
                <div className={classes.suggestions}>
                    <Carousel movies={recomendedMovies}></Carousel>
                </div>
            )}
            <InfiniteScroll
                dataLength={reviews.length}
                next={fetchMoreReviews}
                hasMore={hasMore}
                style={{
                    display: 'inline-flex',
                    flexFlow: 'row wrap',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                {reviews.map((item, index) => (
                    <ReviewCard
                        key={index}
                        movie={item.movie}
                        author={item.author}
                        text={item.text}
                        rating={item.rating}
                    />
                ))}
            </InfiniteScroll>
        </div>
    )
}

export default HomePage
