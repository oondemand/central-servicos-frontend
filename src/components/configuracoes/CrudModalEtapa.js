import React from 'react';

const CrudModalEtapa = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-1/3 p-6 relative">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
                {children}
            
            </div>
        </div>
    );
};

export default CrudModalEtapa;
