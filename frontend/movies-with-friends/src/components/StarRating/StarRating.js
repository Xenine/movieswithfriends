import StarRatings from 'react-star-ratings'

import React from 'react'

function StarRating({ stars, setStars }) {
    return (
        <StarRatings
            rating={stars}
            starRatedColor="var(--mainColor)"
            changeRating={(e) => setStars(e)}
            numberOfStars={10}
            name="rating"
            starDimension="26px"
            starSpacing="5px"
            starHoverColor="var(--secondaryColor)"
        />
    )
}

export default StarRating
