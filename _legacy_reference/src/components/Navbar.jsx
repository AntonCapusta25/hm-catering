import React from 'react'

const Navbar = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <nav className="navbar reveal-stagger">
            <a href="#" className="nav-brand">
                <img src="/logo.png" alt="Homemade" className="nav-logo" />
            </a>
            <div className="nav-links">
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works') }}>
                    How it Works
                </a>
                <a href="#menu-boxes" onClick={(e) => { e.preventDefault(); scrollToSection('menu-boxes') }}>
                    Menus
                </a>
                <a href="#occasions" onClick={(e) => { e.preventDefault(); scrollToSection('occasions') }}>
                    Occasions
                </a>
            </div>
            <a href="#booking" className="nav-btn" onClick={(e) => { e.preventDefault(); scrollToSection('booking') }}>
                Book Now
            </a>
        </nav>
    )
}

export default Navbar
