import React from 'react'

function loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 animate-pulse" role="status" aria-busy="true">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                </div>

                <div className="w-3/4 h-8 bg-gray-300 rounded-md mb-2"></div>
                <div className="w-full h-4 bg-gray-300 rounded-md mb-8"></div>

                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 bg-gray-300"></div>
                </div>
            </div>
        </div>
    )
}

export default loading