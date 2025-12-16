import { useState } from 'react'
import { submitChefApplication } from '../lib/supabase'

const ChefSignup = () => {
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        experience: '',
        email: '',
        portfolio: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

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
            await submitChefApplication({
                ...formData,
                experience: parseInt(formData.experience) || 0
            })
            setShowSuccess(true)
            setFormData({
                name: '',
                specialty: '',
                experience: '',
                email: '',
                portfolio: ''
            })

            setTimeout(() => {
                setShowSuccess(false)
                setShowForm(false)
            }, 3000)
        } catch (error) {
            console.error('Chef signup error:', error)
            alert('Error submitting application: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="chef-signup" className="section text-center">
            <div className="container">
                <h2>Are You a Chef?</h2>
                <p className="mb-40">Join our exclusive network.</p>

                {!showForm ? (
                    <button className="btn-secondary" onClick={() => setShowForm(true)}>
                        Apply as Chef
                    </button>
                ) : (
                    <div className="booking-section" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
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
                                <label>Specialty</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    className="form-control"
                                    placeholder="e.g., French Cuisine, Pastry"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Years of Experience</label>
                                <input
                                    type="number"
                                    name="experience"
                                    className="form-control"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Portfolio URL (Optional)</label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    className="form-control"
                                    placeholder="https://..."
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ flex: 1, border: 'none' }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        {showSuccess && (
                            <div style={{ color: 'green', marginTop: '20px', fontSize: '1.2rem' }}>
                                ✓ Application submitted successfully!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export default ChefSignup
