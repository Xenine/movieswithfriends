import { $authHost, $host } from './client'

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
