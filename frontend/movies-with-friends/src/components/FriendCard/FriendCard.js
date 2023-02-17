import React from 'react'
import classes from './FriendCard.module.scss'

const FriendCard = ({ friend, clickHandle, isRequest = false }) => {
    return (
        <div className={classes.container}>
            <div className={classes.left}>
                <img
                    className={classes.avatar}
                    width={54}
                    height={54}
                    src={
                        friend.avatar_url
                            ? friend.avatar_url
                            : '/img/account.svg'
                    }
                    alt="avatar"
                />
                <div className={classes.names}>
                    {friend.telegram_username && (
                        <div className={classes.namesTop}>
                            @{friend.telegram_username}
                        </div>
                    )}
                    <div className={classes.nameBottom}>
                        {friend.first_name} {friend.second_name}
                    </div>
                </div>
            </div>
            <div className={classes.right}>
                {isRequest ? (
                    <button onClick={() => clickHandle(friend.id)}>
                        <img
                            src="https://img.icons8.com/ios-glyphs/30/12B886/checkmark--v1.png"
                            alt="accept"
                        />
                    </button>
                ) : (
                    <button onClick={() => clickHandle(friend.id)}>
                        <img
                            src="https://img.icons8.com/glyph-neue/30/e63033/delete.png"
                            alt="delete"
                        />
                    </button>
                )}
            </div>
        </div>
    )
}

export default FriendCard
