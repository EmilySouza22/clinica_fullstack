import React from 'react'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative'>
                {/* botão de fechar */}
                <button
                    onClick={onClose}
                    className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 font-bold text-lg cursor-pointer'
                >
                    x
                </button>

                {children}
            </div>
        </div>
    )
}

export default Modal