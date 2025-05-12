'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import AccessDenied from '@/components/Access-denied/access-denied';
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar';
import HomeCards from '@/components/layout/Service-provider-components/Service-provider-home/service-provider-home-cards';
import RequestCard from '@/components/layout/Service-provider-components/Service-provider-home/service-provider-request-card';

function Home() {
  const { status, data: session } = useSession();


  const requestsTestData = [
    {
      clientName: "Carlos Méndez",
      serviceType: "Plomería",
      description: "Reparación de fuga en el baño principal, agua goteando constantemente del lavamanos. Es urgente ya que está causando daños en el piso.",
      requestDate: "3 Mayo, 2025 - 10:15",
      isNew: true,
      isPriority: true,
      onAccept: () => console.log("Solicitud de Carlos aceptada"),
      onDecline: () => console.log("Solicitud de Carlos rechazada"),
      onMessage: () => console.log("Enviando mensaje a Carlos")
    },
    {
      clientName: "María González",
      serviceType: "Cañería",
      description: "Instalación de grifo nuevo en la cocina. El actual está oxidado y gotea.",
      requestDate: "5 Mayo, 2025 - 16:45",
      isNew: false,
      isPriority: false,
      clientAvatar: "/img/avatars/client2.jpg",
      onAccept: () => console.log("Solicitud de María aceptada"),
      onDecline: () => console.log("Solicitud de María rechazada"),
      onMessage: () => console.log("Enviando mensaje a María")
    },
    {
      clientName: "Roberto Sánchez",
      serviceType: "Electricidad",
      description: "Problema con la instalación eléctrica, los interruptores saltan constantemente cuando enciendo más de dos aparatos. Necesito revisión urgente.",
      requestDate: "4 Mayo, 2025 - 09:30",
      isNew: true,
      isPriority: true,
      onAccept: () => console.log("Solicitud de Roberto aceptada"),
      onDecline: () => console.log("Solicitud de Roberto rechazada"),
      onMessage: () => console.log("Enviando mensaje a Roberto")
    },
    {
      clientName: "Ana López",
      serviceType: "Carpintería",
      description: "Reparación de puerta de armario que no cierra correctamente. La bisagra parece estar suelta.",
      requestDate: "6 Mayo, 2025 - 11:20",
      isNew: false,
      isPriority: false,
      onAccept: () => console.log("Solicitud de Ana aceptada"),
      onDecline: () => console.log("Solicitud de Ana rechazada"),
      onMessage: () => console.log("Enviando mensaje a Ana")
    },
    {
      clientName: "Ana López",
      serviceType: "Carpintería",
      description: "Reparación de puerta de armario que no cierra correctamente. La bisagra parece estar suelta.",
      requestDate: "6 Mayo, 2025 - 11:20",
      isNew: false,
      isPriority: false,
      onAccept: () => console.log("Solicitud de Ana aceptada"),
      onDecline: () => console.log("Solicitud de Ana rechazada"),
      onMessage: () => console.log("Enviando mensaje a Ana")
    },
    {
      clientName: "Ana López",
      serviceType: "Carpintería",
      description: "Reparación de puerta de armario que no cierra correctamente. La bisagra parece estar suelta.",
      requestDate: "6 Mayo, 2025 - 11:20",
      isNew: false,
      isPriority: false,
      onAccept: () => console.log("Solicitud de Ana aceptada"),
      onDecline: () => console.log("Solicitud de Ana rechazada"),
      onMessage: () => console.log("Enviando mensaje a Ana")
    }
  ];

  if (!session || session.user.role !== 'SERVICE_PROVIDER') {
    return <AccessDenied
      message="Esta área es solo para proveedores de servicios"
    />;
  }

  return (
    <div className="flex h-screen">
      <ServiceProviderSidebar
        userName={session?.user.name || ''}
        userType={session?.user.role || ''}
      />

      <div className="flex-1 p-8 overflow-y-auto px-40">
        <h1 className="text-2xl font-bold mb-2">Panel de emprendedor</h1>
        <p className="mb-6">Bienvenido, {session?.user.name}!</p>

        <div className="mb-8">
          <HomeCards />
        </div>

        <div className="mb-4">
          <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4">Solicitudes Recientes</h2>
            {requestsTestData.map((request, index) => (
              <RequestCard
                key={index}
                clientName={request.clientName}
                serviceType={request.serviceType}
                description={request.description}
                requestDate={request.requestDate}
                isNew={request.isNew}
                isPriority={request.isPriority}
                clientAvatar={request.clientAvatar}
                onAccept={request.onAccept}
                onDecline={request.onDecline}
                onMessage={request.onMessage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;