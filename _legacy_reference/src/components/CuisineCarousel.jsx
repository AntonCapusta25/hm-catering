import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules'
import { getCuisines } from '../lib/supabase'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

const CuisineCarousel = () => {
    const [cuisines, setCuisines] = useState([])

    // Fallback cuisines if database is empty
    const fallbackCuisines = [
        { name: 'Italian', image_url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        { name: 'French', image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        { name: 'Asian', image_url: 'https://images.unsplash.com/photo-1541544744-cc81127adbdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        { name: 'Vegan', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        { name: 'Seafood', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }
    ]

    useEffect(() => {
        const loadCuisines = async () => {
            try {
                const data = await getCuisines()
                if (data && data.length > 0) {
                    setCuisines(data)
                } else {
                    setCuisines(fallbackCuisines)
                }
            } catch (error) {
                console.error('Error loading cuisines:', error)
                setCuisines(fallbackCuisines)
            }
        }

        loadCuisines()
    }, [])

    // Triple the slides for smooth loop
    const slides = [...cuisines, ...cuisines, ...cuisines]

    return (
        <section
            id="cuisine-marquee"
            style={{
                background: 'var(--bg-cream)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <div className="container" style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
                <h2 className="section-title" style={{ fontSize: '3rem' }}>Our Cuisines</h2>
            </div>

            <div className="swiper mySwiper" style={{ width: '100%', paddingTop: '50px', paddingBottom: '50px' }}>
                <Swiper
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView="auto"
                    loop={true}
                    speed={800}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: 35,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[EffectCoverflow, Pagination, Autoplay]}
                >
                    {slides.map((cuisine, index) => (
                        <SwiperSlide key={index}>
                            <img src={cuisine.image_url} alt={cuisine.name} loading="lazy" />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '20px',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.5rem'
                                }}
                            >
                                {cuisine.name}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}

export default CuisineCarousel
