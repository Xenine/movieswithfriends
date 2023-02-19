import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import classes from './PlayerPage.module.scss'

const PlayerPage = () => {
    const { id } = useParams()

    useEffect(() => {
        const script = document.createElement('script')
        script.src = '/kinidb.js'
        document.body.appendChild(script)

        return () => {
            script.remove()
        }
    }, [])

    return (
        <div className={classes.wrapper}>
            <div
                id="kinobd"
                data-resize="1"
                data-bg="#000"
                data-kinopoisk={id}
            />
        </div>
    )
}

export default PlayerPage
