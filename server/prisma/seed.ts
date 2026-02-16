import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_BLOCKED_PHRASES = [
  'send money', 'wire transfer', 'bitcoin', 'crypto', 'investment opportunity',
  'gofundme', 'cashapp', 'venmo', 'paypal me', 'donate', 'bank account',
  'financial help', 'inheritance',
];

async function main() {
  console.log('Seeding database...');

  // Seed blocked phrases
  const phraseCount = await prisma.blockedPhrase.count();
  if (phraseCount === 0) {
    await prisma.blockedPhrase.createMany({
      data: DEFAULT_BLOCKED_PHRASES.map((phrase) => ({
        phrase,
        category: 'financial_scam',
        isActive: true,
      })),
    });
    console.log(`Seeded ${DEFAULT_BLOCKED_PHRASES.length} blocked phrases`);
  }

  // Create admin user
  const adminEmail = 'admin@stillhere.app';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123456', 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        displayName: 'Admin',
        locationCity: 'Skopje',
        locationCountry: 'Macedonia',
        isAdmin: true,
        verificationStatus: 'verified',
      },
    });
    console.log('Created admin user: admin@stillhere.app / admin123456');
  }

  // Create seed users
  const seedUsers = [
    {
      email: 'riley@example.com',
      displayName: 'Riley',
      locationCity: 'Skopje',
      locationCountry: 'Macedonia',
      verificationStatus: 'verified',
      conditionSummary: 'Stage 4 lung cancer. Good days and bad days.',
      energyLevel: 'varies',
      promptNoPatience: 'Small talk about the weather',
      promptWantCompany: 'a long drive with the windows down',
      promptBodyCanHandle: 'walking, sitting, eating slowly',
      promptBeforeIGo: 'see the ocean one more time',
    },
    {
      email: 'amara@example.com',
      displayName: 'Amara',
      locationCity: 'Belgrade',
      locationCountry: 'Serbia',
      verificationStatus: 'community_verified',
      communityCodeUsed: 'Hospice Sue Ryder',
      conditionSummary: 'ALS. Still mobile most days.',
      energyLevel: 'moderate',
      promptNoPatience: 'being treated like I\'m already gone',
      promptWantCompany: 'cooking something ridiculous',
      promptBodyCanHandle: 'moderate activity, need rest breaks',
      promptBeforeIGo: 'laugh until it hurts',
    },
    {
      email: 'milo@example.com',
      displayName: 'Milo',
      locationCity: 'Zagreb',
      locationCountry: 'Croatia',
      verificationStatus: 'basic',
      conditionSummary: 'Pancreatic. Not much time.',
      energyLevel: 'low',
      promptNoPatience: 'anyone saying "stay positive"',
      promptWantCompany: 'watching movies in silence',
      promptBodyCanHandle: 'virtual calls, short walks',
      promptBeforeIGo: 'tell my story to someone who\'ll remember it',
    },
  ];

  for (const userData of seedUsers) {
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash('password123', 12);
      await prisma.user.create({
        data: { ...userData, passwordHash },
      });
      console.log(`Created seed user: ${userData.email}`);
    }
  }

  // Create seed moment requests
  const riley = await prisma.user.findUnique({ where: { email: 'riley@example.com' } });
  const amara = await prisma.user.findUnique({ where: { email: 'amara@example.com' } });
  const milo = await prisma.user.findUnique({ where: { email: 'milo@example.com' } });

  if (riley && amara && milo) {
    const momentCount = await prisma.momentRequest.count();
    if (momentCount === 0) {
      await prisma.momentRequest.createMany({
        data: [
          {
            userId: riley.id,
            title: 'Sunset drive. No pressure to talk.',
            description: 'Could use calm company for 45 minutes.',
            category: 'nature',
            energyLevelNeeded: 'low',
            locationType: 'flexible',
            locationName: 'Somewhere near Skopje',
          },
          {
            userId: amara.id,
            title: 'Street noodles and bad jokes',
            description: 'In and out in an hour.',
            category: 'food',
            energyLevelNeeded: 'moderate',
            locationType: 'specific',
            locationName: 'Belgrade Old Town',
          },
          {
            userId: milo.id,
            title: 'Virtual movie tonight',
            description: 'Camera optional.',
            category: 'virtual',
            locationType: 'virtual',
          },
          {
            userId: riley.id,
            title: 'Coffee, no small talk',
            description: 'Just sit with me.',
            category: 'talk',
            energyLevelNeeded: 'low',
            locationType: 'flexible',
          },
          {
            userId: amara.id,
            title: 'Something irresponsible but not stupid',
            description: 'I have no idea what. That\'s the point.',
            category: 'ridiculous',
            energyLevelNeeded: 'high',
            locationType: 'flexible',
          },
        ],
      });
      console.log('Created 5 seed moment requests');
    }
  }

  // Create a community code
  const codeCount = await prisma.communityCode.count();
  if (codeCount === 0) {
    await prisma.communityCode.create({
      data: {
        organizationName: 'Hospice Sue Ryder Bitola',
        organizationType: 'hospice',
        code: 'SUERYDERBITOLA',
        isActive: true,
      },
    });
    console.log('Created community code: SUERYDERBITOLA');
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
