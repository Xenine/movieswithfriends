import React, { useEffect, useState } from 'react'
import { Switch } from 'react'
import { patchUser } from '../../http/API'
import classes from './SettingsComponent.module.scss'

const SettingsComponent = ({ user, setUser }) => {
    const onPublicReviewsChange = async (e) => {
        setUser((user) => ({
            ...user,
            public_reviews: e,
        }))
        patchUser(user.id, { public_reviews: e })
    }

    const onPublicBookmarksChange = async (e) => {
        setUser((user) => ({
            ...user,
            public_bookmarks: e,
        }))
        patchUser(user.id, { public_bookmarks: e })
    }

    const onOnlyFriendsReviewsChange = async (e) => {
        setUser((user) => ({
            ...user,
            only_friends_reviews: e,
        }))
        patchUser(user.id, { only_friends_reviews: e })
    }

    return (
        <div className={classes.container}>
            {/* <div className={classes.title}>Настройки</div> */}
            <fieldset className={classes.block}>
                <legend className={classes.subtitle}>Публичные отзывы</legend>
                <input
                    type="radio"
                    id="publicReviewsTrue"
                    name="publicReviews"
                    checked={user.public_reviews === true}
                    value="true"
                    onChange={(e) => onPublicReviewsChange(true)}
                />
                <label htmlFor="publicReviewsTrue">
                    Мои отзывы доступны всем пользователям
                </label>
                <br />
                <input
                    type="radio"
                    id="publicReviewsFalse"
                    name="publicReviews"
                    checked={user.public_reviews === false}
                    value="false"
                    onChange={(e) => onPublicReviewsChange(false)}
                />
                <label htmlFor="publicReviewsFalse">
                    Мои отзывы доступны только друзьям
                </label>
            </fieldset>
            <fieldset className={classes.block}>
                <legend className={classes.subtitle}>Публичные закладки</legend>
                <input
                    type="radio"
                    id="publicBookmarksTrue"
                    name="publicBookmarks"
                    checked={user.public_bookmarks === true}
                    value="true"
                    onChange={(e) => onPublicBookmarksChange(true)}
                />
                <label htmlFor="publicBookmarksTrue">
                    Мои закладки доступны всем пользователям
                </label>
                <br />
                <input
                    type="radio"
                    id="publicBookmarksFalse"
                    name="publicBookmarks"
                    checked={user.public_bookmarks === false}
                    value="false"
                    onChange={(e) => onPublicBookmarksChange(false)}
                />
                <label htmlFor="publicBookmarksFalse">
                    Мои закладки доступны только друзьям
                </label>
            </fieldset>
            <fieldset className={classes.block}>
                <legend className={classes.subtitle}>
                    В ленте я хочу видеть
                </legend>
                <input
                    type="radio"
                    id="onlyFriendsReviewsTrue"
                    name="onlyFriendsReviews"
                    checked={user.only_friends_reviews === true}
                    value="true"
                    onChange={(e) => onOnlyFriendsReviewsChange(true)}
                />
                <label htmlFor="onlyFriendsReviewsTrue">
                    Только отзывы друзей
                </label>
                <br />
                <input
                    type="radio"
                    id="onlyFriendsReviewsFalse"
                    name="onlyFriendsReviews"
                    checked={user.only_friends_reviews === false}
                    value="false"
                    onChange={(e) => onOnlyFriendsReviewsChange(false)}
                />
                <label htmlFor="onlyFriendsReviewsFalse">
                    Отзывы всех пользователей
                </label>
            </fieldset>
        </div>
    )
}

export default SettingsComponent
