import React from 'react'

const Occasions = () => {
    const occasions = [
        {
            title: 'Kerstmenu\'s',
            image: 'https://images.unsplash.com/photo-1544025162-d7669d045862?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
            title: 'Shared Dining',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
            title: 'New Year\'s Special',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        }
    ]

    return (
        <section id="occasions" className="section">
            <div className="container">
                <div className="occasions-header">
                    <h2>Occasions</h2>
                    <div className="btn-group" style={{ marginTop: 0, gap: '10px' }}>
                        <button className="btn-icon">←</button>
                        <button className="btn-icon">→</button>
                    </div>
                </div>
                <div className="occasions-scroll-wrapper">
                    {occasions.map((occasion, index) => (
                        <div key={index} className="occasion-card">
                            <img src={occasion.image} alt={occasion.title} />
                            <div className="occasion-overlay">
                                <span className="occasion-title">{occasion.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Occasions
