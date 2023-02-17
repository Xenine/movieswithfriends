import { $authHost, $host } from './client'

// export const login = async (user) => {
//     const userToString = {
//         ...user,
//         auth_date: user.auth_date.toString(),
//         id: user.id.toString(),
//     }
//     await client
//         .post('/api/login', userToString)
//         .then((response) => {
//             localStorage.setItem('user', JSON.stringify(response.user))
//             localStorage.setItem(
//                 'access_token',
//                 JSON.stringify(response.access_token)
//             )
//             return response.user
//         })
//         .catch((err) => {
//             console.log('error in login')
//             localStorage.removeItem('user')
//             localStorage.removeItem('refresh_token')
//             return Promise.reject(err)
//         })
// }

// export const logout = async () => {
//     client.post('/api/logout')
//     localStorage.removeItem('user')
//     localStorage.removeItem('refresh_token')
//     window.location.href = { LOGIN_ROUTE }
// }

// export const refresh = async () => {
//     await client
//         .get('api/refresh')
//         .then((response) => {
//             localStorage.setItem('user', JSON.stringify(response.user))
//             localStorage.setItem(
//                 'access_token',
//                 JSON.stringify(response.access_token)
//             )
//             return response.user
//         })
//         .catch((err) => {
//             localStorage.removeItem('user')
//             localStorage.removeItem('refresh_token')
//             // window.location.href = { LOGIN_ROUTE }
//             return Promise.reject(err)
//         })

//     // client
//     //     .get('api/refresh')
//     //     .then((response) => {
//     //         console.log('get gefresh token')
//     //         localStorage.setItem('user', JSON.stringify(response.user))
//     //         localStorage.setItem(
//     //             'access_token',
//     //             JSON.stringify(response.access_token)
//     //         )
//     //         return response.user
//     //     })
//     //     .catch((err) => {
//     //         console.log('error in refresh')
//     //         localStorage.removeItem('user')
//     //         localStorage.removeItem('refresh_token')
//     //         // window.location.href = { LOGIN_ROUTE }
//     //         return Promise.reject(err)
//     //     })
// }

export default class AuthService {
    static async login(user) {
        return $host.post('api/login', user)
    }

    static async logout() {
        return $authHost.post('api/logout')
    }

    static async refresh() {
        return $host.get('api/refresh')
    }
}
