'use client';

import { Session } from 'next-auth';
import AdminLayout from './admin-layout';
import React, { useState } from 'react';
import Image from 'next/image';

// Tipo para los usuarios
interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SERVICE_PROVIDER';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  image: string;
  createdAt: string;
  lastLogin: string;
}

function AdminUsersManagement({ session }: { session: Session | null }) {
  // Estado para los usuarios
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ana',
      lastName: 'Martínez',
      email: 'ana.martinez@example.com',
      role: 'USER',
      status: 'ACTIVE',
      image: '/img/default-user-image.png',
      createdAt: '2025-01-15T10:30:00Z',
      lastLogin: '2025-06-15T14:20:00Z',
    },
    {
      id: '2',
      name: 'Roberto',
      lastName: 'Silva',
      email: 'roberto.silva@example.com',
      role: 'SERVICE_PROVIDER',
      status: 'ACTIVE',
      image: '/img/default-user-image.png',
      createdAt: '2025-02-22T09:15:00Z',
      lastLogin: '2025-06-14T11:45:00Z',
    },
    {
      id: '3',
      name: 'Carlos',
      lastName: 'Soto',
      email: 'carlos.soto@example.com',
      role: 'USER',
      status: 'INACTIVE',
      image: '/img/default-user-image.png',
      createdAt: '2025-03-10T15:45:00Z',
      lastLogin: '2025-05-20T17:30:00Z',
    },
    {
      id: '4',
      name: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@example.com',
      role: 'SERVICE_PROVIDER',
      status: 'ACTIVE',
      image: '/img/default-user-image.png',
      createdAt: '2025-01-05T11:20:00Z',
      lastLogin: '2025-06-16T09:10:00Z',
    },
    {
      id: '5',
      name: 'Juan',
      lastName: 'López',
      email: 'juan.lopez@example.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      image: '/img/default-user-image.png',
      createdAt: '2024-12-01T08:30:00Z',
      lastLogin: '2025-06-16T10:05:00Z',
    },
  ]);

  // Estado para el usuario seleccionado en el modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Estado para filtros y búsqueda
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Función para cambiar el estado de un usuario
  const changeUserStatus = (id: string, newStatus: 'ACTIVE' | 'INACTIVE' | 'BANNED') => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
    if (selectedUser?.id === id) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  // Función para eliminar un usuario
  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    setIsDeleteModalOpen(false);
    setIsModalOpen(false);
  };

  // Función para abrir el modal con los detalles del usuario
  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Filtrar usuarios basado en los filtros y término de búsqueda
  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  // Obtener el conteo de usuarios por rol
  const userCounts = {
    total: users.length,
    users: users.filter(u => u.role === 'USER').length,
    serviceProviders: users.filter(u => u.role === 'SERVICE_PROVIDER').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    inactive: users.filter(u => u.status === 'INACTIVE').length,
    banned: users.filter(u => u.status === 'BANNED').length,
  };

  return (
    <AdminLayout session={session}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>
        
        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Total Usuarios</h3>
            <p className="text-2xl font-bold">{userCounts.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Consumidores</h3>
            <p className="text-2xl font-bold">{userCounts.users}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Proveedores</h3>
            <p className="text-2xl font-bold">{userCounts.serviceProviders}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Administradores</h3>
            <p className="text-2xl font-bold">{userCounts.admins}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Listado de Usuarios</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <select 
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Todos los roles</option>
                  <option value="USER">Consumidores</option>
                  <option value="SERVICE_PROVIDER">Proveedores</option>
                  <option value="ADMIN">Administradores</option>
                </select>
                <select 
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="ACTIVE">Activos</option>
                  <option value="INACTIVE">Inactivos</option>
                  <option value="BANNED">Bloqueados</option>
                </select>
              </div>
              <input 
                type="text" 
                placeholder="Buscar usuario..." 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            src={user.image || '/img/default-user-image.png'}
                            alt={`${user.name} ${user.lastName}`}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name} {user.lastName}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'SERVICE_PROVIDER' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {user.role === 'ADMIN' ? 'Administrador' : 
                         user.role === 'SERVICE_PROVIDER' ? 'Proveedor' : 
                         'Consumidor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                          user.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {user.status === 'ACTIVE' ? 'Activo' : 
                         user.status === 'INACTIVE' ? 'Inactivo' : 
                         'Bloqueado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.lastLogin)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => openUserDetails(user)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Ver
                      </button>
                      {user.status === 'ACTIVE' && (
                        <button 
                          onClick={() => changeUserStatus(user.id, 'INACTIVE')}
                          className="text-yellow-600 hover:text-yellow-800 mr-3"
                        >
                          Desactivar
                        </button>
                      )}
                      {user.status === 'INACTIVE' && (
                        <button 
                          onClick={() => changeUserStatus(user.id, 'ACTIVE')}
                          className="text-green-600 hover:text-green-800 mr-3"
                        >
                          Activar
                        </button>
                      )}
                      {user.status !== 'BANNED' && (
                        <button 
                          onClick={() => changeUserStatus(user.id, 'BANNED')}
                          className="text-red-600 hover:text-red-800"
                        >
                          Bloquear
                        </button>
                      )}
                      {user.status === 'BANNED' && (
                        <button 
                          onClick={() => changeUserStatus(user.id, 'ACTIVE')}
                          className="text-green-600 hover:text-green-800"
                        >
                          Desbloquear
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No se encontraron usuarios con los criterios de búsqueda</p>
            </div>
          )}
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{filteredUsers.length}</span> de <span className="font-medium">{users.length}</span> usuarios
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Anterior</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Siguiente</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles de usuario */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Detalles del Usuario</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedUser.image || '/img/default-user-image.png'}
                      alt={`${selectedUser.name} ${selectedUser.lastName}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">{selectedUser.name} {selectedUser.lastName}</h4>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex mt-2 space-x-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                          selectedUser.role === 'SERVICE_PROVIDER' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {selectedUser.role === 'ADMIN' ? 'Administrador' : 
                         selectedUser.role === 'SERVICE_PROVIDER' ? 'Proveedor' : 
                         'Consumidor'}
                      </span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${selectedUser.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                          selectedUser.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {selectedUser.status === 'ACTIVE' ? 'Activo' : 
                         selectedUser.status === 'INACTIVE' ? 'Inactivo' : 
                         'Bloqueado'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">ID de Usuario</h4>
                    <p className="text-base text-gray-900 mt-1">{selectedUser.id}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha de registro</h4>
                    <p className="text-base text-gray-900 mt-1">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Último inicio de sesión</h4>
                    <p className="text-base text-gray-900 mt-1">{formatDate(selectedUser.lastLogin)}</p>
                  </div>
                </div>
                
                {/* Aquí irían más detalles como historial de actividades, etc */}
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h4 className="text-lg font-medium text-gray-800 mb-3">Acciones</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedUser.status === 'ACTIVE' && (
                    <button 
                      onClick={() => changeUserStatus(selectedUser.id, 'INACTIVE')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                      Desactivar cuenta
                    </button>
                  )}
                  {selectedUser.status === 'INACTIVE' && (
                    <button 
                      onClick={() => changeUserStatus(selectedUser.id, 'ACTIVE')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Activar cuenta
                    </button>
                  )}
                  {selectedUser.status !== 'BANNED' && (
                    <button 
                      onClick={() => changeUserStatus(selectedUser.id, 'BANNED')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Bloquear cuenta
                    </button>
                  )}
                  {selectedUser.status === 'BANNED' && (
                    <button 
                      onClick={() => changeUserStatus(selectedUser.id, 'ACTIVE')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Desbloquear cuenta
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Eliminar cuenta
                  </button>
                  
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar la cuenta de <span className="font-medium">{selectedUser.name} {selectedUser.lastName}</span>? 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => deleteUser(selectedUser.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminUsersManagement;
