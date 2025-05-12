import React from 'react'

function HomeCards() {
  // Estos datos serían reemplazados por datos reales de tu API
  const stats = {
    active: { count: 24, change: 12 },
    pending: { count: 8, change: 3 },
    completed: { count: 156, change: 8 }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Peticiones Activas */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-600 font-medium">Active Requests</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <div className="flex items-end">
          <span className="text-3xl font-bold">{stats.active.count}</span>
          <span className="ml-2 text-green-500 text-sm flex items-center">
            +{stats.active.change}%
            <svg className="h-3 w-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Peticiones Pendientes */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-600 font-medium">Pending Responses</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-yellow-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div className="flex items-end">
          <span className="text-3xl font-bold">{stats.pending.count}</span>
          <span className="ml-2 text-red-500 text-sm flex items-center">
            +{stats.pending.change}%
            <svg className="h-3 w-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Peticiones Completadas */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-600 font-medium">Completed Services</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div className="flex items-end">
          <span className="text-3xl font-bold">{stats.completed.count}</span>
          <span className="ml-2 text-green-500 text-sm flex items-center">
            +{stats.completed.change}%
            <svg className="h-3 w-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default HomeCards