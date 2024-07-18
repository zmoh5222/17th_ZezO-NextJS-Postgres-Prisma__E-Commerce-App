import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

// import prisma from "@/db/prismaClient";

(async function deleteExpiredDownloadVerificationRecords() {
  const now = new Date();

  try {
    await prisma.downloadVerification.deleteMany({
      where: {
        expiredAt: {
          lt: now,
        },
      },
    });
    console.log('Expired records deleted successfully');
  } catch (error) {
    console.error('Error deleting expired records:', error);
  } finally {
    await prisma.$disconnect();
  }
})()