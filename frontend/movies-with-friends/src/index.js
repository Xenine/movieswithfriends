import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'
import App from './App'
import 'macro-css'
import Store from './store/Store'

export const store = new Store()

export const Context = createContext({
    store,
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Context.Provider
            value={{
                store,
            }}
        >
            <App />
        </Context.Provider>
    </React.StrictMode>
)
