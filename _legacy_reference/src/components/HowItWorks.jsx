import React from 'react'

const HowItWorks = () => {
    const steps = [
        {
            number: 1,
            image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: 'Find the perfect\nmenu box',
            description: 'Discover our menu boxes from the best restaurants.'
        },
        {
            number: 2,
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: 'Choose the\ndelivery date',
            description: 'Delivered chilled and fresh.'
        },
        {
            number: 3,
            image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: 'Finishing touch,\nenjoy',
            description: 'Easily finish at home and enjoy.'
        }
    ]

    return (
        <section id="how-it-works" className="section text-center">
            <div className="container">
                <h2 className="mb-40">How it works</h2>
                <div className="steps-container">
                    <div className="steps-line"></div>
                    <div className="steps-row">
                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className="step-col reveal-step"
                                style={{ transitionDelay: `${index * 0.2}s` }}
                            >
                                <div className="step-number">{step.number}</div>
                                <img src={step.image} className="step-img" alt={`Step ${step.number}`} />
                                <h3 className="step-title">
                                    {step.title.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i < step.title.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </h3>
                                <p className="text-light">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
