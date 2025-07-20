# Budget Guru - Personal Finance Management Dashboard

A comprehensive personal finance management application built with Next.js, TypeScript, and MongoDB.

## Features

- 📊 **Transaction Management**: Add, edit, and delete income and expense transactions
- 📈 **Visual Analytics**: Interactive charts for spending patterns and category breakdowns
- 💰 **Budget Tracking**: Set monthly budgets and track spending against goals
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🔒 **Data Security**: Secure data handling with input validation and sanitization
- ⚡ **Performance**: Optimized for fast loading and smooth user experience

## Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: MongoDB with Mongoose ODM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd budget-guru
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
budgetguru/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── loading.tsx       # Loading UI
│   ├── error.tsx         # Error UI
│   └── not-found.tsx     # 404 page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions
│   ├── api.ts           # API client functions
│   ├── db.ts            # Database connection
│   ├── constants.ts     # App constants
│   └── finance-utils.ts # Finance utility functions
├── models/               # MongoDB models
├── types/                # TypeScript type definitions
└── public/              # Static assets
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/[id]` - Update a transaction
- `DELETE /api/transactions/[id]` - Delete a transaction

### Budgets
- `GET /api/budgets` - Get all budgets with spending calculations
- `POST /api/budgets` - Create/update budgets

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.