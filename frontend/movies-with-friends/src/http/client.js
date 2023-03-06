import axios from 'axios'
import Cookies from 'js-cookie'

const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
}

const URL = process.env.REACT_APP_BASE_URL

const $host = axios.create({
    baseURL: URL,
    headers,
    withCredentials: true,
})

const $authHost = axios.create({
    baseURL: URL,
    headers,
    withCredentials: true,
})

const authRequestInterceptor = (config) => {
    const csrfToken = Cookies.get('csrftoken')
    const accessToken = JSON.parse(localStorage.getItem('access_token'))
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
    }

    if (accessToken) {
        config.headers.Authorization = 'Bearer ' + accessToken
    }

    return config
}

const authResponseErrorInterceptor = async (error) => {
    const originalRequest = error.config
    const errorStatusCode = error.response.status
    if (
        [401, 403].includes(errorStatusCode) &&
        error.config &&
        !error.config._isRetry
    ) {
        originalRequest._isRetry = true
        try {
            const response = await $host.get('api/refresh')
            localStorage.setItem(
                'access_token',
                JSON.stringify(response.data.access_token)
            )
            return $authHost.request(originalRequest)
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error
}

$authHost.interceptors.request.use(authRequestInterceptor)

$authHost.interceptors.response.use(
    (response) => response,
    authResponseErrorInterceptor
)

export { $host, $authHost }
