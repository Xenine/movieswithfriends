import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'
import { fetchUserReviews } from '../../http/API'
import ReviewCard from '../ReviewCard/ReviewCard'

const ReviewsComponent = () => {
    const [reviews, setReviews] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const limit = 10

    const { id } = useParams()

    useEffect(() => {
        fetchUserReviews(id).then((response) => {
            setHasMore(!!response.data.next)
            setReviews(response.data.results)
        })
    }, [])

    const fetchMoreReviews = () => {
        const offset = reviews.length
        fetchUserReviews(id, limit, offset).then((response) => {
            setHasMore(!!response.data.next)
            setReviews([...reviews].concat(response.data.results))
        })
    }

    return (
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
    )
}

export default ReviewsComponent
