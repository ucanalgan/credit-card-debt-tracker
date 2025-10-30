const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Protect all card routes with authentication
router.use(authenticate);

/**
 * @route   POST /api/cards
 * @desc    Create a new credit card
 * @access  Private
 */
router.post('/', asyncHandler(async (req, res) => {
  const { name, balance, interestRate, dueDate, minimumPayment } = req.body;
  const userId = req.user.id; // Get userId from authenticated user

  // Validate required fields
  if (!name || balance === undefined || interestRate === undefined || !dueDate) {
    throw new AppError('Missing required fields: name, balance, interestRate, dueDate', 400);
  }

  // Validate data types and ranges
  if (typeof balance !== 'number' || balance < 0) {
    throw new AppError('Balance must be a positive number', 400);
  }

  if (typeof interestRate !== 'number' || interestRate < 0 || interestRate > 100) {
    throw new AppError('Interest rate must be between 0 and 100', 400);
  }

  if (minimumPayment !== undefined && (typeof minimumPayment !== 'number' || minimumPayment < 0)) {
    throw new AppError('Minimum payment must be a positive number', 400);
  }

  // Create card
  const card = await prisma.creditCard.create({
    data: {
      name,
      balance: parseFloat(balance),
      interestRate: parseFloat(interestRate),
      dueDate: new Date(dueDate),
      minimumPayment: minimumPayment ? parseFloat(minimumPayment) : 0,
      userId
    }
  });

  res.status(201).json(card);
}));

/**
 * @route   GET /api/cards
 * @desc    Get all cards for authenticated user
 * @access  Private
 */
router.get('/', asyncHandler(async (req, res) => {
  const cards = await prisma.creditCard.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });

  res.json(cards);
}));

/**
 * @route   GET /api/cards/:id
 * @desc    Get card by ID with transactions
 * @access  Private
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const card = await prisma.creditCard.findUnique({
    where: {
      id,
      userId: req.user.id // Ensure user owns this card
    },
    include: {
      transactions: {
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!card) {
    throw new AppError('Card not found', 404);
  }

  res.json(card);
}));

/**
 * @route   PUT /api/cards/:id
 * @desc    Update card information
 * @access  Private
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, balance, interestRate, dueDate, minimumPayment } = req.body;

  // Check if card exists and user owns it
  const existingCard = await prisma.creditCard.findUnique({
    where: {
      id,
      userId: req.user.id
    }
  });

  if (!existingCard) {
    throw new AppError('Card not found', 404);
  }

  // Validate data if provided
  if (balance !== undefined && (typeof balance !== 'number' || balance < 0)) {
    throw new AppError('Balance must be a positive number', 400);
  }

  if (interestRate !== undefined && (typeof interestRate !== 'number' || interestRate < 0 || interestRate > 100)) {
    throw new AppError('Interest rate must be between 0 and 100', 400);
  }

  if (minimumPayment !== undefined && (typeof minimumPayment !== 'number' || minimumPayment < 0)) {
    throw new AppError('Minimum payment must be a positive number', 400);
  }

  // Build update data object (only include provided fields)
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (balance !== undefined) updateData.balance = parseFloat(balance);
  if (interestRate !== undefined) updateData.interestRate = parseFloat(interestRate);
  if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
  if (minimumPayment !== undefined) updateData.minimumPayment = parseFloat(minimumPayment);

  const updatedCard = await prisma.creditCard.update({
    where: { id },
    data: updateData
  });

  res.json(updatedCard);
}));

/**
 * @route   DELETE /api/cards/:id
 * @desc    Delete card and all associated transactions
 * @access  Private
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if card exists and user owns it
  const card = await prisma.creditCard.findUnique({
    where: {
      id,
      userId: req.user.id
    }
  });

  if (!card) {
    throw new AppError('Card not found', 404);
  }

  // Delete all associated transactions first
  await prisma.transaction.deleteMany({
    where: { cardId: id }
  });

  // Delete the card
  await prisma.creditCard.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: 'Card and associated transactions deleted successfully'
  });
}));

module.exports = router;
