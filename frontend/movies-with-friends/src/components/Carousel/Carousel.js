import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { Autoplay, Pagination, Navigation } from 'swiper'
import CarouselCard from './CarouselCard/CarouselCard'

const Carousel = ({ movies }) => {
    return (
        <Swiper
            slidesPerView={1}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                waitForTransition: false,
            }}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            // className="mySwiper"
            breakpoints={{
                320: {
                    slidesPerView: 2,
                },
                480: {
                    slidesPerView: 3,
                },
                640: {
                    slidesPerView: 4,
                },
                800: {
                    slidesPerView: 5,
                },
            }}
        >
            {movies.map((item, index) => {
                return (
                    <SwiperSlide key={index}>
                        <CarouselCard movie={item} />
                    </SwiperSlide>
                )
            })}
        </Swiper>
    )
}

export default Carousel
