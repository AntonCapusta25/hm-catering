import React from 'react'

const MenuModal = ({ menu, isOpen, onClose, onReserve }) => {
    if (!menu) return null

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-close" onClick={onClose}>×</div>
                <img src={menu.img} className="modal-header-img" alt={menu.title} />
                <h2 className="modal-title">{menu.title}</h2>
                <p className="modal-chef">{menu.chef}</p>

                <ul className="course-list">
                    {menu.courses.map((course, index) => (
                        <li key={index} className="course-item">
                            <div className="course-name">{course.name}</div>
                            <div className="course-ingredients">{course.desc}</div>
                        </li>
                    ))}
                </ul>

                <button
                    className="btn-primary"
                    style={{ width: '100%', border: 'none' }}
                    onClick={() => onReserve(menu.title)}
                >
                    Reserve This Menu
                </button>
            </div>
        </div>
    )
}

export default MenuModal
