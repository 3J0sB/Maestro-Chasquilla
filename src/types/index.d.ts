

export interface serviceRequest {
    id: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    providerId: string;
    consumerId: string;
    serviceId: string;
    service: service;
    user: user;
}

export interface service {
    id: string;
    title: string;
    price: number?;
    minServicePrice: number?;
    maxServicePrice: number?;
    description: string?;
    serviceTag: string?;
    serviceTag2: string?;
    serviceTag3: string?;
    status: string?;
    image: string?;
    userId: string
    user: user;
}

export interface user {
    id: string;
    name: string;
    lastName: string;
    lastName2: string;
    rut: string;
    email: string;
    emailVerified: boolean;
    image: string;
}

