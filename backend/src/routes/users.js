const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route   POST /api/users
 * @desc    Create a new user (register/login)
 * @access  Public
 */
router.post('/', asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new AppError('Email and name are required', 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email }
  });

  // If user exists, return existing user
  if (user) {
    return res.json(user);
  }

  // Create new user
  user = await prisma.user.create({
    data: { email, name }
  });

  res.status(201).json(user);
}));

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID with their cards
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      cards: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json(user);
}));

/**
 * @route   GET /api/users/:userId/cards
 * @desc    Get all cards for a specific user
 * @access  Public
 */
router.get('/:userId/cards', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new AppError('User ID is required', 400);
  }

  const cards = await prisma.creditCard.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  res.json(cards);
}));

module.exports = router;
