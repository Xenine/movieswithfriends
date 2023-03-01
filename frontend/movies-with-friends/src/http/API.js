import { $authHost, $host } from './client'

export const fetchMovies = async () => {
    const movies = await $authHost.get('api/movies')
    return movies.data
}

export const fetchMovie = async (id) => {
    const movie = await $authHost.get(`api/movies/${id}`)
    return movie.data
}

export const searchUsers = async (search) => {
    const users = await $authHost.get(`api/users/?search=${search}`)
    return users.data
}

export const searchMovies = async (search, limit = 10, offset = 0) => {
    const users = await $authHost.get(
        `api/movies/?search=${search}&limit=${limit}&offset=${offset}`
    )
    return users.data
}

export const postReview = async (data) => {
    return $authHost.post('api/review/', data)
}

export const fetchReviews = async (limit = 10, offset = 0) => {
    return $authHost.get(`api/review/?limit=${limit}&offset=${offset}`)
}

export const postAddFriend = async (id) => {
    return $authHost.post(`api/friends/${id}/add_friend/`)
}

export const postAcceptFriendRequest = async (id) => {
    return $authHost.post(`api/friends/${id}/accept/`)
}

export const deleteFriend = async (id) => {
    return $authHost.delete(`api/friends/${id}/delete_friend/`)
}

export const cancelRequest = async (id) => {
    return $authHost.delete(`api/friends/${id}/delete_request/`)
}

export const fetchNewMovies = async () => {
    return $host.get('api/movies/latest/')
}

export const fetchRecomendedMovies = async () => {
    return $host.get('api/movies/recomended/')
}
