const { PrismaClient } = require('@prisma/client');

// Singleton pattern for PrismaClient
let prisma;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return prisma;
}

// Handle cleanup on process termination
process.on('beforeExit', async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

module.exports = { prisma: getPrismaClient() };
