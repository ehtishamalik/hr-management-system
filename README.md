# HRM System

A comprehensive Human Resources Management System that helps manage employee leave requests, policies, team oversight, and administrative functions.

## Features

### User Management

- Role-based access (User, Manager, Admin)
- User profiles with personal information
- Team management for managers

### Leave Management

- Multiple leave types (Casual, Sick, Annual, Half Day, Short Leave)
- Leave application and approval workflow
- Leave history tracking
- Automatic leave balance calculation
- Leave remarks system for communication

### Policy Management

- Create and manage company policies
- Rich text editor for policy content
- Active/inactive policy status

### Admin Tools

- User management and creation
- Leave type configuration
- Leave balance oversight
- System settings management

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL via [Neon](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [better-auth](https://github.com/better-auth/better-auth)
- **Email**: [Resend](https://resend.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Form Handling**: [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Rich Text Editor**: [TipTap](https://tiptap.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

### Prerequisites

- Node.js 18+ and yarn
- PostgreSQL database (or Neon database URL)

### Environment Setup

Create a .env file in the root directory with the following variables:

```
DATABASE_URL=your_postgres_connection_string
BETTER_AUTH_SECRET=better_auth_secret
NEXT_PUBLIC_BETTER_AUTH_URL=your_auth_url
RESEND_FROM="Company name <login@domain.com>"
RESEND_API_KEY=your_resend_api_key
```

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   yarn install
   ```
3. Run database migrations
   ```bash
   yarn migrate
   ```
4. Seed the database
   ```bash
   yarn seed
   ```

### Development

Start the development server:

```bash
yarn dev
```

The application will be available at http://localhost:3001

### Build and Deployment

Build for production:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/             # React components
├── constants/              # Application constants
├── db/                     # Database schema, migrations
├── enum/                   # TypeScript enums
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and helpers
├── public/                 # Static assets
└── types/                  # TypeScript types
```

## Database Schema

The application uses several key tables:

- `user` - User accounts
- `user_detail` - Extended user information
- `leave` - Leave requests
- `leave_type` - Leave categories configuration
- `leave_year` - Annual leave cycles
- `policy` - Company policies
- `leave_remark` - Comments on leave requests

## Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn generate` - Generate Drizzle migrations
- `yarn migrate` - Run database migrations
- `yarn studio` - Start Drizzle Studio for database inspection
- `yarn seed` - Seed the database with initial data

## Default Accounts

#### You can login with any of the following demo accounts:

Default password is: password1234

### Admin User

- Email: johndoe@ehtishamalik.com

### Manager User

- Email: richard@ehtishamalik.com
- Email: jane@ehtishamalik.com

### Regular User

- Email: alex@ehtishamalik.com
- Email: chris@ehtishamalik.com
- Email: sam@ehtishamalik.com
- Email: jordan@ehtishamalik.com

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
