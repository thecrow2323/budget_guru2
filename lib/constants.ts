// Application constants
export const APP_CONFIG = {
  name: 'Budget Guru',
  description: 'Personal Finance Management Dashboard',
  version: '1.0.0',
  author: 'Budget Guru Team'
} as const;

// API Configuration
export const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com/api' 
    : '/api'
} as const;

// Database Configuration
export const DB_CONFIG = {
  maxConnections: 10,
  bufferCommands: false,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true
} as const;

// UI Constants
export const UI_CONFIG = {
  maxTransactionsPerPage: 50,
  chartColors: [
    '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
    '#EC4899', '#84CC16', '#6366F1', '#F97316', '#14B8A6'
  ],
  animationDuration: 300
} as const;

// Validation Constants
export const VALIDATION_CONFIG = {
  minAmount: 0.01,
  maxAmount: 999999.99,
  minDescriptionLength: 3,
  maxDescriptionLength: 100,
  maxCategoryLength: 50
} as const;