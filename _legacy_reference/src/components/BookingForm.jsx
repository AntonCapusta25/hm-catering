import { useState, useEffect } from 'react'
import { submitBooking } from '../lib/supabase'
import gsap from 'gsap'

const BookingForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        guests: 4,
        service_type: 'chef',
        selected_menu: ''
    })
    const [totalPrice, setTotalPrice] = useState(600)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const servicePrices = {
        chef: 150,
        box: 65
    }

    useEffect(() => {
        updatePrice()
    }, [formData.service_type, formData.guests])

    const updatePrice = () => {
        const basePrice = servicePrices[formData.service_type] || 0
        const guests = parseInt(formData.guests) || 0
        const total = basePrice * guests

        // Animate price change
        gsap.to({ val: totalPrice }, {
            val: total,
            duration: 0.4,
            onUpdate: function () {
                setTotalPrice(Math.round(this.targets()[0].val))
            }
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await submitBooking(formData)
            setShowSuccess(true)
            setFormData({
                name: '',
                date: '',
                guests: 4,
                service_type: 'chef',
                selected_menu: ''
            })

            setTimeout(() => {
                setShowSuccess(false)
            }, 5000)
        } catch (error) {
            console.error('Booking error:', error)
            alert('Error submitting booking: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="booking" className="section">
            <div className="container">
                <div className="booking-section">
                    <h2 className="text-center mb-40">Book Your Experience</h2>
                    <form onSubmit={handleSubmit} className="booking-form">
                        <div className="form-grid">
                            <div className="form-group span-2">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Guests</label>
                                <input
                                    type="number"
                                    name="guests"
                                    className="form-control"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    min="1"
                                />
                            </div>
                            <div className="form-group span-2">
                                <label>Service Type</label>
                                <select
                                    name="service_type"
                                    className="form-control"
                                    value={formData.service_type}
                                    onChange={handleChange}
                                >
                                    <option value="chef">Private Chef (Start €150)</option>
                                    <option value="box">Menu Box (Start €65)</option>
                                </select>
                            </div>
                            <div className="form-group span-2">
                                <label>Selected Menu / Cuisine</label>
                                <input
                                    type="text"
                                    id="selectedMenu"
                                    name="selected_menu"
                                    className="form-control"
                                    placeholder="Select a menu above or type cuisine..."
                                    value={formData.selected_menu}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="total-card">
                            <span>ESTIMATED TOTAL</span>
                            <h3 style={{ color: 'var(--primary-orange)', fontSize: '2.5rem', margin: '10px 0' }}>
                                €{totalPrice}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>Enter details to see price</p>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ marginTop: '20px', width: '100%', border: 'none' }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Request Booking'}
                            </button>
                        </div>
                    </form>
                    {showSuccess && (
                        <div style={{ textAlign: 'center', color: 'green', marginTop: '20px', fontSize: '1.2rem' }}>
                            ✓ Booking requested successfully!
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default BookingForm
