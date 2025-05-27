import { PrismaClient, Role } from '../src/generated/prisma'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()
async function main() {
  const ServiceProviderUser = await prisma.serviceProviderUser.create({
    data: {
      rut: '11111111-9',
      email: 'service@test.com',
      hashedPassword: await bcrypt.hash('1234', 10),
      name: 'Service provider User',
      lastName: 'service provider',
      lastName2: 'service provider',

    },
  })

  console.log(`[SEED] ---> Created SERVICE PROVIDER user with id: ${ServiceProviderUser.id}`)

  const ServiceProviderUserLocation = await prisma.location.create({
    data: {
      address: '123 Main St',
      city: 'Talca',
      region: 'Maule',
      country: 'Chile',
      latitude: -33.4489, 
      longitude: -70.6693,
      serviceProvider: {
        connect: { id: ServiceProviderUser.id }
      },
    },
  })

  console.log(`[SEED] ---> Created location for SERVICE PROVIDER with id: ${ServiceProviderUserLocation.id}`)

  const ConsumerUser = await prisma.user.create({
    data: {
      email: 'consumer@test.com',
      rut: '22222222-9',
      hashedPassword: await bcrypt.hash('1234', 10),
      name: 'Consumer User',
      lastName: 'Consumer User',
      lastName2: 'Consumer User ',
      role: 'USER',
    },
  })
  console.log(`[SEED] ---> Created CONSUMER user with id: ${ConsumerUser.id}`)

  const ConsumerUser2 = await prisma.user.create({
    data: {
      email: 'consumer2@test.com',
      rut: '22222221-9',
      hashedPassword: await bcrypt.hash('1234', 10),
      name: 'Consumer User',
      lastName: 'Consumer User',
      lastName2: 'Consumer User ',
      role: 'USER',
    },
  })

  console.log(`[SEED] ---> Created CONSUMER user with id: ${ConsumerUser2.id}`)


  const AdminUser = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      rut: '33333333-9',
      hashedPassword: await bcrypt.hash('1234', 10),
      name: 'Admin User',
      lastName: 'Admin User',
      lastName2: 'Admin User ',
      role: 'ADMIN',
    },
  })

  console.log(`[SEED] ---> Created ADMIN user with id: ${AdminUser.id}`)


  const serviceTest = await prisma.services.create({
    data: {
      title: 'Test Service',
      price: 100,
      description: 'This is a test service',
      userId: ServiceProviderUser.id,
      serviceTag: 'Test Tag1',
      serviceTag2: 'Test Tag2',
      serviceTag3: 'Test Tag3',
    }
  })

  console.log(`[SEED] ---> Created ServiceTest with id: ${serviceTest.id}`)


  const review = await prisma.reviews.create({

    data: {
      rating: 5,
      comment: 'This is a test review',
      serviceId: serviceTest.id,
      userId: ConsumerUser.id,
    }
  })

  console.log(`[SEED] ---> Created Review with id: ${review.id}`)

  const review2 = await prisma.reviews.create({
    data: {
      rating: 4,
      comment: 'This is a test review number 2',
      serviceId: serviceTest.id,
      userId: ConsumerUser2.id,
    }
  })

  console.log(`[SEED] ---> Created Review with id: ${review2.id}`)

  const serviceTest2 = await prisma.services.create({
    data: {
      title: 'Test Service2',
      price: 500,
      minServicePrice: 50,
      maxServicePrice: 1000,
      description: 'This is a test service',
      userId: ServiceProviderUser.id,
      serviceTag: 'Test Tag1',
      serviceTag2: 'Test Tag2',
      serviceTag3: 'Test Tag3',
    }
  })
  console.log(`[SEED] ---> Created ServiceTest2 with id: ${serviceTest2.id}`)

  const serviceTest3 = await prisma.services.create({
    data: {
      title: 'Test Service3',
      price: 500,
      minServicePrice: 50,
      maxServicePrice: 1000,
      description: 'This is a test service',
      userId: ServiceProviderUser.id,
      serviceTag: 'Test Tag1',
      serviceTag2: 'Test Tag2',
      serviceTag3: 'Test Tag3',
    }
  })
  console.log(`[SEED] ---> Created ServiceTest2 with id: ${serviceTest3.id}`)


  const serviceRequestTest = await prisma.serviceRequest.create({
    data: {
      consumerId: ConsumerUser.id,
      serviceId: serviceTest.id,
      providerId: ServiceProviderUser.id,
      status: 'PENDING',
      message: 'This is a test service request number 1',
    }
  })
  console.log(`[SEED] ---> Created Service request test with id: ${serviceRequestTest.id}`)

  const serviceRequestTest2 = await prisma.serviceRequest.create({
    data: {
      consumerId: ConsumerUser.id,
      serviceId: serviceTest2.id,
      providerId: ServiceProviderUser.id,
      status: 'PENDING',
      message: 'This is a test service request number 2',
    }
  })
  console.log(`[SEED] ---> Created Service request test with id: ${serviceRequestTest2.id}`)

  const serviceRequestTest3 = await prisma.serviceRequest.create({
    data: {
      consumerId: ConsumerUser.id,
      serviceId: serviceTest3.id,
      providerId: ServiceProviderUser.id,
      status: 'PENDING',
      message: 'This is a test service request number 3',
    }
  })
  // console.table(serviceRequestTest)
  console.log(`[SEED] ---> Created Service request test with id: ${serviceRequestTest3.id}`)


  const category = await prisma.categories.createMany({
    data: [
      { name: 'Hogar y mantenimiento' },
      { name: 'Confección y moda' },
      { name: 'Automotrices' },
      { name: 'Creativos y personalizados' },
      { name: 'Alimentos y catering' },
      { name: 'Servicios personales y de bienestar ' },
      { name: 'Educación y apoyo escolar' },
      { name: 'Artesanías y productos hechos a mano' },
      { name: 'Servicios técnicos y digitales' },
    ]
  })

  console.log(`[SEED] ---> Created: ${category.count} categories`)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })