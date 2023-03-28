import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../..'
import { useParams } from 'react-router-dom'
import classes from './AccountPage.module.scss'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {
    cancelRequest,
    deleteFriend,
    fetchUser,
    postAddFriend,
} from '../../http/API'
import SettingsComponent from '../../components/SettingsComponent/SettingsComponent'
import BookmarksComponent from '../../components/BookmarksComponent/BookmarksComponent'
import ReviewsComponent from '../../components/ReviewsComponent/ReviewsComponent'
import NeedRegistrationComponent from '../../components/NeedRegistrationComponent/NeedRegistrationComponent'

const AccountPage = observer(() => {
    const { store } = useContext(Context)
    const { id } = useParams()
    const [user, setUser] = useState({})
    const [isFriend, setIsFriend] = useState(false)
    const [isFriendButton, setIsFriendButton] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchUser(id).then((response) => {
            setUser(response.data)
            if (store.isAuth) {
                const isFriendInStore = store.isInFriends(id)
                setIsFriendButton(isFriendInStore)
                setIsFriend(isFriendInStore)
            }
            setIsLoading(false)
        })
    }, [id])

    const onClickAdd = async () => {
        postAddFriend(id).then(() => {
            setIsFriendButton(true)
        })
    }

    const onClickRemove = async () => {
        if (store.isInFriends) {
            deleteFriend(id)
        } else {
            cancelRequest(id)
        }
        setIsFriendButton(false)
    }

    if (isLoading) {
        return <h3 className="d-flex justify-center">Загрузка...</h3>
    }

    return (
        <div className={classes.container}>
            <div className={classes.main_info}>
                <div className={classes.avatar}>
                    <img
                        width={162}
                        height={162}
                        src={
                            user.avatar_url
                                ? user.avatar_url
                                : '/img/account.svg'
                        }
                        alt="avatar"
                    />
                </div>
                <div className={classes.title}>
                    Профиль {user?.first_name} {user?.second_name}
                    <div className={classes.subtitle}>
                        @{user?.telegram_username}
                    </div>
                </div>
                <div className={classes.friend_button_wrapper}>
                    {store.isAuth ? (
                        store.user.id == id &&
                        (isFriendButton ? (
                            <button
                                className={classes.delete_button}
                                onClick={onClickRemove}
                            >
                                Удалить из друзей
                            </button>
                        ) : (
                            <button
                                className={classes.button}
                                onClick={onClickAdd}
                            >
                                Отправить запрос дружбы
                            </button>
                        ))
                    ) : (
                        <NeedRegistrationComponent text="Чтобы увидеть больше информации о пользователе войдите" />
                    )}
                </div>
            </div>
            {(store.user.id == id ||
                isFriend ||
                user.public_bookmarks ||
                user.public_reviews) && (
                <Tabs>
                    <TabList>
                        {(store.user.id == id ||
                            isFriend ||
                            user.public_bookmarks) && <Tab>Закладки</Tab>}
                        {(store.user.id == id ||
                            isFriend ||
                            user.public_reviews) && <Tab>Отзывы</Tab>}
                        {store.user.id == id && <Tab>Настройки</Tab>}
                    </TabList>

                    {(store.user.id == id ||
                        isFriend ||
                        user.public_bookmarks) && (
                        <TabPanel>
                            <BookmarksComponent />
                        </TabPanel>
                    )}
                    {(store.user.id == id ||
                        isFriend ||
                        user.public_reviews) && (
                        <TabPanel>
                            <ReviewsComponent />
                        </TabPanel>
                    )}
                    {store.user.id == id && (
                        <TabPanel>
                            <SettingsComponent user={user} setUser={setUser} />
                        </TabPanel>
                    )}
                </Tabs>
            )}
        </div>
    )
})

export default AccountPage
