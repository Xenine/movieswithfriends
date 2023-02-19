import React, { useEffect, useState } from 'react'
import MovieCard from '../../components/MovieCard/MovieCard'
import { fetchReviews } from '../../http/API'
import classes from './HomePage.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'

const HomePage = () => {
    const [reviews, setReviews] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const limit = 10

    useEffect(() => {
        fetchReviews().then((response) => {
            setReviews(response.data.results)
        })
    }, [])

    const fetchMoreMovies = () => {
        const offset = reviews.length
        fetchReviews(limit, offset).then((data) => {
            setHasMore(!!data.next)
            setReviews([...reviews].concat(data.results))
        })
    }

    return (
        <div className="content">
            <div className="suggestions d-flex justify-center">
                <div className="suggestions-card m-30"></div>
            </div>
            <div className={classes.items}>
                <InfiniteScroll
                    dataLength={reviews.length}
                    next={fetchMoreMovies}
                    hasMore={hasMore}
                    loader={<h4>Загрузка...</h4>}
                >
                    {reviews.map((item, index) => (
                        <MovieCard
                            key={index}
                            movie={item.movie}
                            author={item.author}
                            text={item.text}
                            rating={item.rating}
                        />
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default HomePage
