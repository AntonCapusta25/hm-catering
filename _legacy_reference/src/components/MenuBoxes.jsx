import { useState, useRef } from 'react'
import MenuModal from './MenuModal'

const MenuBoxes = () => {
    const [selectedMenu, setSelectedMenu] = useState(null)
    const carouselRef = useRef(null)

    const menuDetails = {
        'christmas-4-course': {
            title: 'Classic Christmas 4-course',
            chef: 'Bergpaviljoen Bistronomique',
            price: '€64,50 p.p.',
            img: 'https://images.unsplash.com/photo-1544025162-d7669d045862?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            badge: '📊 Level 2',
            courses: [
                { name: 'Amuse Loembia', desc: 'Crispy duck confit, hoisin glaze, pickled cucumber.' },
                { name: 'Lobster Bisque', desc: 'Rich cognac cream, chives, brioche croutons, chili oil.' },
                { name: 'Rouleau of Pheasant', desc: 'Sauerkraut, truffle gravy, caramelized apple, potato mousseline.' },
                { name: 'Grand Dessert', desc: 'Dark chocolate mousse, salted caramel, gold leaf, hazelnut praline.' }
            ]
        },
        'brut172': {
            title: 'Brut172 Christmas Experience',
            chef: 'Hans Van Wolde',
            price: '€99,50 p.p.',
            img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            badge: '❄️ Level 2',
            courses: [
                { name: 'King Crab & Caviar', desc: 'Lemon gel, dill emulsion, crispy quinoa.' },
                { name: 'Wild Boar Stew', desc: 'Slow-cooked in red wine, roasted root vegetables, puff pastry.' },
                { name: 'Venison Steak', desc: 'Blackberry jus, parsnip puree, roasted brussels sprouts.' },
                { name: 'Floating Island', desc: 'Vanilla creme anglaise, spun sugar, almond crunch.' }
            ]
        },
        'ron-gastrobar': {
            title: 'Ron\'s Gastrobar Special',
            chef: 'Ron Blaauw',
            price: '€31,00 p.p.',
            img: 'https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            badge: '📊 Level 1',
            courses: [
                { name: 'Tuna Tataki', desc: 'Sesame crust, wasabi mayo, soy reduction.' },
                { name: 'Indonesian Rendang', desc: 'Coconut beef curry, fluffy white rice, sambal beans.' },
                { name: 'Passionfruit Cheesecake', desc: 'Cookie crumble, mango sorbet, mint.' }
            ]
        }
    }

    const menus = [
        { key: 'christmas-4-course', title: 'Christmas 4-course', chef: 'Bergpaviljoen Bistronomique' },
        { key: 'brut172', title: 'Brut172 Christmas', chef: 'Hans Van Wolde' },
        { key: 'ron-gastrobar', title: 'Ron Gastrobar', chef: 'Ron Blaauw' }
    ]

    const openModal = (menuKey) => {
        setSelectedMenu(menuDetails[menuKey])
    }

    const closeModal = () => {
        setSelectedMenu(null)
    }

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -360 : 360
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    const navigateToBooking = (menuName) => {
        closeModal()
        const bookingSection = document.getElementById('booking')
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' })
            // Set the menu in the booking form
            setTimeout(() => {
                const menuInput = document.getElementById('selectedMenu')
                if (menuInput) {
                    menuInput.value = menuName
                }
            }, 500)
        }
    }

    return (
        <>
            <section id="menu-boxes" className="section">
                <div className="container">
                    <div className="occasions-header">
                        <div>
                            <h2>Menu boxes</h2>
                            <p className="text-light">Click a card to view full menu details & ingredients.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <a href="#" className="view-all-btn">View all menus ↗</a>
                            <button className="btn-icon arrow-left" onClick={() => scrollCarousel('left')}>←</button>
                            <button className="btn-icon arrow-right" onClick={() => scrollCarousel('right')}>→</button>
                        </div>
                    </div>

                    <div className="menu-carousel" id="menuCarousel" ref={carouselRef}>
                        {menus.map((menu) => {
                            const details = menuDetails[menu.key]
                            return (
                                <div
                                    key={menu.key}
                                    className="menu-card"
                                    onClick={() => openModal(menu.key)}
                                >
                                    <div className="menu-card-img-wrapper">
                                        <img src={details.img} className="menu-card-img" alt={menu.title} />
                                        <div className="card-badge">{details.badge}</div>
                                        <div className="card-heart">♡</div>
                                    </div>
                                    <h3>{menu.title}</h3>
                                    <p className="text-light">{menu.chef}</p>
                                    <div className="menu-footer">
                                        <span style={{ fontWeight: 700 }}>{details.price}</span>
                                        <button
                                            className="btn-select-menu"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigateToBooking(menu.title)
                                            }}
                                        >
                                            Reserve
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <MenuModal
                menu={selectedMenu}
                isOpen={!!selectedMenu}
                onClose={closeModal}
                onReserve={navigateToBooking}
            />
        </>
    )
}

export default MenuBoxes
