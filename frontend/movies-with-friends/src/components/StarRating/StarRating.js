import StarRatings from 'react-star-ratings'

import React from 'react'

function StarRating({ stars, setStars }) {
    return (
        <StarRatings
            rating={stars}
            starRatedColor="#ebc834"
            changeRating={(e) => setStars(e)}
            numberOfStars={10}
            name="rating"
            starDimension="26px"
            starSpacing="5px"
            starHoverColor="#5767aa"
        />
    )
}

export default StarRating
