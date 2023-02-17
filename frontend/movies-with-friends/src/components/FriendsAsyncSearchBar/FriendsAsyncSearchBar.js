import React, { useCallback, useState } from 'react'
import Select from 'react-select'
import debounce from 'lodash.debounce'
import { searchUsers } from '../../http/API'

const AsyncSearchBar = ({ setCollabs }) => {
    const [searchedUsers, setSearchedUsers] = useState([])

    const makeRequest = useCallback(
        debounce((str) => {
            searchUsers(str).then((users) => {
                setSearchedUsers(users)
            })
        }, 500),
        []
    )

    const handleSearch = (value) => {
        if (value.length >= 3) makeRequest(value)
    }

    return (
        <Select
            placeholder="Найди друга по его @username"
            getOptionLabel={(e) => e.telegram_username}
            getOptionValue={(e) => e.id}
            options={searchedUsers}
            onInputChange={(value) => handleSearch(value)}
            onChange={(value) => setCollabs(value.id)}
            theme={(theme) => ({
                ...theme,
                borderRadius: 2,
                colors: {
                    ...theme.colors,
                    primary25: 'white',
                    primary: 'black',
                    neutral0: 'white',
                },
            })}
        />
    )
}

export default AsyncSearchBar
