import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Context } from '../..'
import FriendsAsyncSearchBar from '../../components/FriendsAsyncSearchBar/FriendsAsyncSearchBar'
import FriendCard from '../../components/FriendCard/FriendCard'
import {
    cancelRequest,
    deleteFriend,
    postAcceptFriendRequest,
    postAddFriend,
} from '../../http/API'
import classes from './FriendsPage.module.scss'

const FriendsPage = () => {
    const { store } = useContext(Context)
    const [addedUser, setAddedUser] = useState('')

    const addHandler = async (id) => {
        postAddFriend(id).then((user) => {
            setAddedUser(user.data)
        })
    }

    const acceptHandler = async (id) => {
        postAcceptFriendRequest(id).then(() => {
            const number = store.user.friend_requests.findIndex(
                (friend) => friend.id === id
            )
            const user_copy = JSON.parse(JSON.stringify(store.user))
            user_copy.added_friends.unshift(
                user_copy.friend_requests.splice(number, 1)[0]
            )
            store.setUser(user_copy)
        })
    }

    const deleteHandler = async (id) => {
        deleteFriend(id).then(() => {
            const number = store.user.added_friends.findIndex(
                (friend) => friend.id === id
            )
            const user_copy = JSON.parse(JSON.stringify(store.user))
            user_copy.added_friends.splice(number, 1)
            store.setUser(user_copy)
        })
    }

    const cancelHandler = async (id) => {
        cancelRequest(id).then(() => {
            setAddedUser('')
        })
    }

    return (
        <div className="d-flex flex-column align-center">
            <div className={classes.search}>
                <FriendsAsyncSearchBar setCollabs={addHandler} />
            </div>
            {addedUser && (
                <FriendCard
                    key={addedUser.id}
                    friend={addedUser}
                    clickHandle={cancelHandler}
                />
            )}
            <div className="mt-10 mb-10 d-flex flex-column align-center w100p">
                {store.user.friend_requests?.map((item, index) => (
                    <FriendCard
                        key={index}
                        friend={item}
                        isRequest={true}
                        clickHandle={acceptHandler}
                    />
                ))}
            </div>
            <div className="mt-10 mb-10 d-flex flex-column align-center w100p">
                {store.user.added_friends?.map((item, index) => (
                    <FriendCard
                        key={index}
                        friend={item}
                        clickHandle={deleteHandler}
                    />
                ))}
            </div>
        </div>
    )
}

export default observer(FriendsPage)
