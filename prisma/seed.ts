// prisma/seed.ts
// =============================================================
// DATABASE SEEDER
// Populates the database with sample data for testing.
// Run: npx ts-node prisma/seed.ts
// =============================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@carrental.com' },
    update: {},
    create: {
      email: 'admin@carrental.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create a regular user
  const userPassword = await bcrypt.hash('User@123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'USER',
    },
  });
  console.log('Regular user created:', user.email);

  // Create sample cars
  const cars = [
    {
      make: 'Toyota', model: 'Corolla', year: 2023, category: 'economy',
      pricePerDay: 55, seats: 5, transmission: 'automatic', fuelType: 'gasoline', available: true,
    },
    {
      make: 'Honda', model: 'CR-V', year: 2023, category: 'suv',
      pricePerDay: 85, seats: 5, transmission: 'automatic', fuelType: 'gasoline', available: true,
    },
    {
      make: 'Tesla', model: 'Model 3', year: 2024, category: 'sedan',
      pricePerDay: 120, seats: 5, transmission: 'automatic', fuelType: 'electric', available: true,
    },
    {
      make: 'BMW', model: '5 Series', year: 2023, category: 'luxury',
      pricePerDay: 180, seats: 5, transmission: 'automatic', fuelType: 'gasoline', available: true,
    },
    {
      make: 'Ford', model: 'Transit', year: 2022, category: 'van',
      pricePerDay: 95, seats: 8, transmission: 'manual', fuelType: 'diesel', available: true,
    },
  ];

  for (const carData of cars) {
    const car = await prisma.car.create({ data: carData });
    console.log(`✅ Car added: ${car.year} ${car.make} ${car.model}`);
  }

  console.log('\nDatabase seeded successfully!');
  console.log('Admin: admin@carrental.com / Admin@123');
  console.log('User:  user@example.com / User@123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });