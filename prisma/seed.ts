import { PrismaClient, Role } from '../src/generated/prisma'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()
async function main() {
  const ServiceProviderUser = await prisma.user.create({
    data: {
        email: 'Service@test.com',
        hashedPassword: await bcrypt.hash('1234', 10),
        name: 'Service provider User',
        lastName: 'service provider',
        lastName2: 'service provider',
        role: 'SERVICE_PROVIDER',
    },
  })

  console.log(`[SEED] ---> Created SERVICE PROVIDER user with id: ${ServiceProviderUser.id}`)
    
  const ConsumerUser = await prisma.user.create({
    data: {
        email: 'Consumer@test.com',
        hashedPassword: await bcrypt.hash('1234', 10),
        name: 'Consumer User',
        lastName: 'Consumer User',
        lastName2: 'Consumer User ',
        role: 'USER',
    },
  })

  console.log(`[SEED] ---> Created CONSUMER user with id: ${ConsumerUser.id}`)

  const AdminUser = await prisma.user.create({
    data: {
        email: 'Admin@test.com',
        hashedPassword: await bcrypt.hash('1234', 10),
        name: 'Admin User',
        lastName: 'Admin User',
        lastName2: 'Admin User ',
        role: 'ADMIN',
    },
  })
  
  console.log(`[SEED] ---> Created ADMIN user with id: ${AdminUser.id}`)

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