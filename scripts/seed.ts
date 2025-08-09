import { AppDataSource } from '../src/data-source';
import { Property } from '../src/properties/properties.entity'

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Property);
  const p = repo.create({
    title: 'Air studio',
    description: 'Manageable studio downtown',
    pricePerNight: 10.0,
    availableFrom: '2025-09-01',
    availableTo: '2025-10-31',
  });
  await repo.save(p);
  console.log('seeded');
  await AppDataSource.destroy();
}

seed();
