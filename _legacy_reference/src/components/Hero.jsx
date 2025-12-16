import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const Hero = () => {
    const heroWrapperRef = useRef(null)

    useEffect(() => {
        const heroWrapper = heroWrapperRef.current
        if (!heroWrapper) return

        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40
            const y = (e.clientY / window.innerHeight - 0.5) * 40

            gsap.to('.collage-1', { duration: 1, x: x * 1.5, y: y * 1.5, ease: 'power2.out' })
            gsap.to('.collage-2', { duration: 1, x: x * -1, y: y * -1, ease: 'power2.out' })
            gsap.to('.collage-3', { duration: 1, x: x * 2, y: y * 2, ease: 'power2.out' })
            gsap.to('.floating-badge', { duration: 1.5, x: x * 0.5, y: y * 0.5, ease: 'power2.out' })
        }

        heroWrapper.addEventListener('mousemove', handleMouseMove)

        return () => {
            heroWrapper.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <header className="hero-wrapper" ref={heroWrapperRef}>
            <div className="container hero-grid">
                <div className="hero-text">
                    <h1 className="reveal-stagger">
                        Savor the<br />
                        Magic of<br />
                        Christmas
                    </h1>
                    <p className="hero-subtitle reveal-stagger">
                        Whether you're hosting a gala or seeking a private chef, we bring the warmth and taste of Christmas
                        to your table.
                    </p>
                    <div className="hero-btns reveal-stagger">
                        <a href="#booking" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollToSection('booking') }}>
                            Book Experience
                        </a>
                        <a href="#chef-signup" className="btn-secondary" onClick={(e) => { e.preventDefault(); scrollToSection('chef-signup') }}>
                            Join as Chef
                        </a>
                    </div>
                </div>

                <div className="hero-collage">
                    <div className="floating-badge badge-pos-1 reveal-pop">🌟 Michelin Star Chefs</div>
                    <div className="floating-badge badge-pos-2 reveal-pop">🍷 Matches Perfectly</div>

                    <img
                        src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        className="collage-img collage-1 parallax-layer"
                        alt="Chef"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1576867757603-05b134ebc379?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        className="collage-img collage-2 parallax-layer"
                        alt="Table"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1574672280602-95995c723820?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        className="collage-img collage-3 parallax-layer"
                        alt="Detail"
                    />
                </div>
            </div>
        </header>
    )
}

export default Hero
