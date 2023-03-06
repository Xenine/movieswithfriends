import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'
import { fetchUserBookmarks } from '../../http/API'
import MovieCard from '../MovieCard/MovieCard'

import classes from './BookmarksComponent.module.scss'

const BookmarksComponent = () => {
    const [bookmarks, setBookmarks] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const limit = 10

    const { id } = useParams()

    useEffect(() => {
        fetchUserBookmarks(id).then((response) => {
            setHasMore(!!response.data.next)
            setBookmarks(response.data.results)
        })
    }, [id])

    const fetchMoreBookmarks = () => {
        const offset = bookmarks.length
        fetchUserBookmarks(id, limit, offset).then((response) => {
            setHasMore(!!response.data.next)
            setBookmarks([...bookmarks].concat(response.data.results))
        })
    }

    return (
        <div className={classes.list_wrapper}>
            <InfiniteScroll
                dataLength={bookmarks.length}
                next={fetchMoreBookmarks}
                hasMore={hasMore}
                // loader={<h4>Загрузка...</h4>}
            >
                {bookmarks.map((item) => {
                    return <MovieCard key={item.id} movie={item} />
                })}
            </InfiniteScroll>
        </div>
    )
}

export default BookmarksComponent
