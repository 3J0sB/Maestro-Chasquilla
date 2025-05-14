import React from 'react'

function loading() {
  return (
    <div className="flex h-screen animate-pulse" role="status" aria-busy="true">
  <div className="w-64 h-screen bg-gray-300"></div>
  <div className="flex-1 p-8 overflow-y-auto px-4 md:px-10 lg:px-20 xl:px-40">
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="w-3/4 h-8 bg-gray-300 rounded-md"></div>
        <div className="w-24 h-10 bg-gray-300 rounded-md"></div>
      </div>
      <div className="relative w-full mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="w-5 h-5 bg-gray-300 rounded-md"></div>
        </div>
        <div className="w-full h-10 bg-gray-300 rounded-lg"></div>
      </div>
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-48 bg-gray-300 rounded-md"></div>
        <div className="w-full h-48 bg-gray-300 rounded-md"></div>
      </div>
      <div className="text-center py-10 bg-gray-300 rounded-lg border border-gray-200">
        <div className="w-12 h-12 mx-auto bg-gray-300 rounded-full mb-4"></div>
        <div className="w-3/4 h-4 bg-gray-300 rounded-md"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded-md"></div>
        <button className="mt-4 w-24 h-10 bg-gray-300 rounded-lg"></button>
      </div>
    </div>
  </div>
</div>
  )
}

export default loading