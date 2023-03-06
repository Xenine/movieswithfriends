import React, { useCallback, useState } from 'react'
import debounce from 'lodash.debounce'
import { searchMovies } from '../../http/API'
import InfiniteScroll from 'react-infinite-scroll-component'
import classes from './SearchPage.module.scss'
import MovieCard from '../../components/MovieCard/MovieCard'

const SearchPage = () => {
    const [searchString, setSearchString] = useState('')
    const [searchedMovies, setSearchedMovies] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const limit = 10

    const makeRequest = useCallback(
        debounce((str) => {
            searchMovies(str, 10).then((data) => {
                setHasMore(!!data.next)
                setSearchedMovies(data.results)
            })
        }, 500),
        []
    )

    const fetchMoreMovies = () => {
        const offset = searchedMovies.length
        searchMovies(searchString, limit, offset).then((data) => {
            setHasMore(!!data.next)
            setSearchedMovies([...searchedMovies].concat(data.results))
        })
    }

    const searchHandle = (value) => {
        setSearchString(value)
        setSearchedMovies([])
        if (value.length > 3) makeRequest(value)
    }

    return (
        <div className="d-flex justify-center align-center flex-column">
            <div className="mt-20 justify-center">
                <input
                    value={searchString}
                    onInput={(e) => searchHandle(e.target.value)}
                    type="text"
                    id="header-search"
                    placeholder="Найди фильм"
                />
            </div>
            <div className={classes.list_wrapper}>
                <InfiniteScroll
                    dataLength={searchedMovies.length}
                    next={fetchMoreMovies}
                    hasMore={hasMore}
                    loader={<h4>Загрузка...</h4>}
                >
                    {searchedMovies.map((item) => {
                        return <MovieCard key={item.id} movie={item} />
                    })}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default SearchPage
