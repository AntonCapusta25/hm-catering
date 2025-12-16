import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Occasions from './components/Occasions'
import CuisineCarousel from './components/CuisineCarousel'
import HowItWorks from './components/HowItWorks'
import MenuBoxes from './components/MenuBoxes'
import BookingForm from './components/BookingForm'
import ChefSignup from './components/ChefSignup'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

function App() {
    useEffect(() => {
        // Initialize Lenis smooth scroll
        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        // GSAP reveal animations - wait for DOM to be ready
        setTimeout(() => {
            // Set initial state with CSS
            gsap.set('.reveal-stagger', { y: 80, opacity: 0 })
            gsap.set('.reveal-pop', { scale: 0.8, opacity: 0 })

            // Animate TO visible state
            gsap.to('.reveal-stagger', {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            })

            gsap.to('.reveal-pop', {
                scale: 1,
                opacity: 1,
                duration: 1,
                stagger: 0.15,
                ease: 'back.out(1.7)',
                delay: 0.5
            })
        }, 100)

        // Cleanup
        return () => {
            lenis.destroy()
        }
    }, [])

    return (
        <>
            <Navbar />
            <Hero />
            <Occasions />
            <CuisineCarousel />
            <HowItWorks />
            <MenuBoxes />
            <BookingForm />
            <ChefSignup />
        </>
    )
}

export default App
