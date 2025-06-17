'use client';

import { Session } from 'next-auth';
import AdminLayout from './admin-layout';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Tipo para los usuarios
interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SERVICE_PROVIDER';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  image: string | null;
  createdAt: string;
  lastLogin: string;
  deletedAt: string | null;
}

function AdminUsersManagement({ session }: { session: Session | null }) {
  // Estado para los usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        
        if (!response.ok) {
          throw new Error('Error al cargar los usuarios');
        }
        
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('No se pudieron cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
  const changeUserStatus = async (id: string, newStatus: 'ACTIVE' | 'INACTIVE' | 'BANNED') => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          // Si el estado es inactivo o baneado, se marca como eliminado
          deletedAt: newStatus === 'ACTIVE' ? null : new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al cambiar el estado del usuario a ${newStatus}`);
      }

      // Actualizar estado local
      setUsers(users.map(user => 
        user.id === id ? { 
          ...user, 
          status: newStatus,
          deletedAt: newStatus === 'ACTIVE' ? null : new Date().toISOString()
        } : user
      ));
      
      if (selectedUser?.id === id) {
        setSelectedUser({ 
          ...selectedUser, 
          status: newStatus,
          deletedAt: newStatus === 'ACTIVE' ? null : new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(`Error al cambiar estado de usuario:`, error);
      setError(`Error al cambiar el estado del usuario`);
    }
  };

  // Función para eliminar un usuario
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      // Actualizar estado local
      setUsers(users.filter(user => user.id !== id));
      setIsDeleteModalOpen(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError('Error al eliminar el usuario');
      setIsDeleteModalOpen(false);
    }
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
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
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
                  <option value="BANNED">Baneados</option>
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
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron usuarios
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <Image 
                                src={user.image || '/img/default-user-image.png'} 
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name} {user.lastName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'SERVICE_PROVIDER' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {user.role === 'ADMIN' ? 'Administrador' : 
                             user.role === 'SERVICE_PROVIDER' ? 'Proveedor' : 
                             'Consumidor'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                              user.status === 'BANNED' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {user.status === 'ACTIVE' ? 'Activo' : 
                             user.status === 'BANNED' ? 'Baneado' : 
                             'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => openUserDetails(user)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Ver
                          </button>
                          <button 
                            onClick={() => user.status === 'ACTIVE' ? changeUserStatus(user.id, 'INACTIVE') : changeUserStatus(user.id, 'ACTIVE')}
                            className={`${user.status === 'ACTIVE' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'} mr-3`}
                          >
                            {user.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                          </button>
                          {user.status !== 'BANNED' && (
                            <button 
                              onClick={() => changeUserStatus(user.id, 'BANNED')}
                              className="text-red-600 hover:text-red-800"
                            >
                              Banear
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles del usuario */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Usuario</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start mb-6 gap-6">
              <div className="flex-shrink-0 h-24 w-24 relative">
                <Image 
                  src={selectedUser.image || '/img/default-user-image.png'} 
                  alt={selectedUser.name}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Nombre Completo</h4>
                    <p className="text-base text-gray-900">{selectedUser.name} {selectedUser.lastName}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                    <p className="text-base text-gray-900">{selectedUser.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Rol</h4>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                        selectedUser.role === 'SERVICE_PROVIDER' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {selectedUser.role === 'ADMIN' ? 'Administrador' : 
                       selectedUser.role === 'SERVICE_PROVIDER' ? 'Proveedor' : 
                       'Consumidor'}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Estado</h4>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedUser.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        selectedUser.status === 'BANNED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {selectedUser.status === 'ACTIVE' ? 'Activo' : 
                       selectedUser.status === 'BANNED' ? 'Baneado' : 
                       'Inactivo'}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Fecha de Registro</h4>
                    <p className="text-base text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Último Acceso</h4>
                    <p className="text-base text-gray-900">{formatDate(selectedUser.lastLogin)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button 
                onClick={() => selectedUser.status === 'ACTIVE' ? changeUserStatus(selectedUser.id, 'INACTIVE') : changeUserStatus(selectedUser.id, 'ACTIVE')}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedUser.status === 'ACTIVE' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {selectedUser.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
              </button>
              {selectedUser.status !== 'BANNED' && (
                <button 
                  onClick={() => changeUserStatus(selectedUser.id, 'BANNED')}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Banear
                </button>
              )}
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar permanentemente al usuario {selectedUser.name} {selectedUser.lastName}? Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => deleteUser(selectedUser.id)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminUsersManagement;
