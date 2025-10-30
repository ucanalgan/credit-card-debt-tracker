const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Protect all transaction routes with authentication
router.use(authenticate);

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction and update card balance
 * @access  Public
 */
router.post('/', asyncHandler(async (req, res) => {
  const { amount, type, date, description, cardId } = req.body;

  // Validate required fields
  if (!amount || !type || !date || !cardId) {
    throw new AppError('Missing required fields: amount, type, date, cardId', 400);
  }

  // Validate transaction type
  if (type !== 'payment' && type !== 'purchase') {
    throw new AppError('Transaction type must be either "payment" or "purchase"', 400);
  }

  // Validate amount
  if (typeof amount !== 'number' || amount <= 0) {
    throw new AppError('Amount must be a positive number', 400);
  }

  // Check if card exists and user owns it
  const card = await prisma.creditCard.findUnique({
    where: {
      id: cardId,
      userId: req.user.id
    }
  });

  if (!card) {
    throw new AppError('Card not found or you do not have permission', 404);
  }

  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(amount),
      type,
      date: new Date(date),
      description: description || '',
      cardId
    }
  });

  // Calculate new balance
  let newBalance = card.balance;
  if (type === 'payment') {
    newBalance -= amount;
  } else if (type === 'purchase') {
    newBalance += amount;
  }

  // Prevent negative balance for payments
  if (newBalance < 0) {
    await prisma.transaction.delete({
      where: { id: transaction.id }
    });
    throw new AppError('Payment amount cannot exceed current balance', 400);
  }

  // Update card balance
  await prisma.creditCard.update({
    where: { id: cardId },
    data: { balance: newBalance }
  });

  res.status(201).json({
    transaction,
    newBalance
  });
}));

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for authenticated user's cards
 * @access  Private
 */
router.get('/', asyncHandler(async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      card: {
        userId: req.user.id
      }
    },
    orderBy: { date: 'desc' },
    include: {
      card: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  res.json(transactions);
}));

/**
 * @route   GET /api/transactions/card/:cardId
 * @desc    Get all transactions for a specific card
 * @access  Private
 */
router.get('/card/:cardId', asyncHandler(async (req, res) => {
  const { cardId } = req.params;

  // Verify user owns the card
  const card = await prisma.creditCard.findUnique({
    where: {
      id: cardId,
      userId: req.user.id
    }
  });

  if (!card) {
    throw new AppError('Card not found or you do not have permission', 404);
  }

  const transactions = await prisma.transaction.findMany({
    where: { cardId },
    orderBy: { date: 'desc' }
  });

  res.json(transactions);
}));

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      card: true
    }
  });

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  res.json(transaction);
}));

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction and reverse balance change
 * @access  Public
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get transaction details with card
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { card: true }
  });

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  // Verify user owns the card
  if (transaction.card.userId !== req.user.id) {
    throw new AppError('You do not have permission to delete this transaction', 403);
  }

  // Calculate reversed balance
  let newBalance = transaction.card.balance;
  if (transaction.type === 'payment') {
    newBalance += transaction.amount; // Add back the payment
  } else if (transaction.type === 'purchase') {
    newBalance -= transaction.amount; // Subtract back the purchase
  }

  // Prevent negative balance
  if (newBalance < 0) {
    throw new AppError('Cannot delete transaction: would result in negative balance', 400);
  }

  // Update card balance
  await prisma.creditCard.update({
    where: { id: transaction.cardId },
    data: { balance: newBalance }
  });

  // Delete the transaction
  await prisma.transaction.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: 'Transaction deleted and balance updated successfully',
    newBalance
  });
}));

module.exports = router;
