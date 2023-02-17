import { makeAutoObservable } from 'mobx'
import AuthService from '../http/AuthService'

export default class Store {
    constructor() {
        this._user = {}
        this._isAuth = false
        this._isLoading = false
        makeAutoObservable(this, {}, { deep: true })
    }

    setAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }

    setLoading(bool) {
        this._isLoading = bool
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    get isLoading() {
        return this._isLoading
    }

    async login(user) {
        try {
            const userToString = {
                ...user,
                auth_date: user.auth_date.toString(),
                id: user.id.toString(),
            }
            const response = await AuthService.login(userToString)
            localStorage.setItem(
                'access_token',
                JSON.stringify(response.data.access_token)
            )
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log('error in login')
            console.log(e.response?.data?.detail)
        }
    }

    async logout() {
        try {
            await AuthService.logout()
            localStorage.removeItem('access_token')
            this.setAuth(false)
            this.setUser({})
        } catch (e) {
            console.log('error in logout')
            console.log(e.response?.data?.detail)
            this.setAuth(false)
            this.setUser({})
        }
    }

    async refresh() {
        this.setLoading(true)
        try {
            const response = await AuthService.refresh()
            localStorage.setItem(
                'access_token',
                JSON.stringify(response.data.access_token)
            )
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log('error in refresh')
            console.log(e.response?.data?.message)
        } finally {
            this.setLoading(false)
        }
    }
}
