# HR Management System

**HR Management System** is a comprehensive Human Resources Management System built for a software company in Pakistan, designed to streamline employee management, leave administration, attendance tracking, provident fund management, medical benefits, and policy management. The application features role-based access control, real-time dashboards, and automated workflows.

## Features

### 👤 User Management

- **Role-Based Access Control**: User, Manager, and Admin roles with tailored permissions
- **User Profiles**: Comprehensive user information (personal details, contact info, CNIC, designation, salary)
- **Team Management**: Managers can oversee and manage their team members
- **Admin Panel**: Complete administrative control over users, leave balances, and policies
- **Emergency Contacts**: Store and manage emergency contact information for employees
- **User Deactivation**: Admins can deactivate employee accounts without deleting data
- **Session Management**: Users can view and revoke active sessions

### 📅 Leave Management

- **Multiple Leave Types**: Admin-configurable leave categories (Casual, Sick, Annual, etc.) with paid/unpaid classification
- **Leave Application Workflow**: Streamlined request submission and approval process
- **Leave History Tracking**: Complete audit trail of all leave requests
- **Automatic Leave Balance Calculation**: Real-time leave balance updates per year
- **Leave Remarks System**: Manager annotations and communication on leave requests
- **Leave Processing**: Review and process leave requests with approval/rejection workflows
- **Leave Suspension**: Admins can suspend leave requests when policy requires
- **Leave Type Administration**: Create and manage leave types with custom balances per employee
- **Leave Balance Management**: Admins can set and adjust individual employee leave balances per year

### ⏰ Late Arrival Management

- **Late Arrival Tracking**: Record and manage employee late arrivals
- **Automated Resolution**: Mark late arrivals as resolved with notes
- **Manager Oversight**: Track team member attendance patterns

### 💰 Provident Fund (PF) Management

- **PF Settings per Employee**: Configure employee and company contribution amounts and types
- **Contribution Types**: Fixed amount or match-employee contribution modes for company side
- **Monthly Processing**: Admins can run monthly PF processing in bulk for all active employees
- **PF Ledger**: Full transaction history (monthly contributions and withdrawals) per employee
- **PF Balance Summary**: Admin view of all employees' current PF balances
- **PF Reports**: Per-employee detailed reports with monthly breakdown
- **Employee PF View**: Employees can view their own PF balance and contribution history

### 🏥 Medical Benefits Management

- **Medical Expense Tracking**: Record monthly medical expenses per employee
- **Annual Limits**: Admin-configurable medical limits per year
- **Utilization View**: Employees can see their current year medical usage vs limit
- **Admin Management**: Admins can view and manage all employee medical expenses and set annual limits

### 📋 Policy Management

- **Policy Creation & Management**: Create, update, and manage company policies
- **Rich Text Editor**: Format policies with detailed content using TipTap editor
- **Policy Status**: Toggle policies between active and inactive states
- **Policy Distribution**: Easy access for all employees

### 📊 Dynamic Dashboards

- **User Dashboard**: Personalized leave status, upcoming requests, and notifications
- **Manager Dashboard**: Team overview, pending approvals, and analytics
- **Admin Dashboard**: System-wide statistics, user management, and reporting

### 🎨 Appearance & Theming

- **Dark / Light Mode**: Toggle between dark and light UI modes
- **Theme Customization**: Choose from multiple color themes
- **Persistent Preferences**: Theme settings are saved per user

## Tech Stack

| Category | Technologies |
|----------|---|
| **Frontend** | [React 19](https://react.dev/), [Next.js 16](https://nextjs.org/) with App Router |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Database** | PostgreSQL via [Neon](https://neon.tech/) |
| **ORM** | [Drizzle ORM 0.45](https://orm.drizzle.team/) |
| **Authentication** | [better-auth 1.6](https://www.better-auth.com/) |
| **Email** | [Resend 6.x](https://resend.com/) |
| **UI Component Library** | [shadcn/ui](https://ui.shadcn.com/) with [Radix UI](https://www.radix-ui.com/) |
| **Styling** | [Tailwind CSS 4.x](https://tailwindcss.com/) |
| **Theme Management** | [next-themes](https://github.com/pacocoursey/next-themes) |
| **Forms** | [react-hook-form 7.x](https://react-hook-form.com/) + [Zod 4.x](https://zod.dev/) |
| **Rich Text Editor** | [TipTap 3.x](https://tiptap.dev/) |
| **Date Utilities** | [date-fns 4.x](https://date-fns.org/) |
| **Client Data Fetching** | [SWR 2.x](https://swr.vercel.app/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [Sonner 2.x](https://sonner.emilkowal.ski/) |
| **HTML Sanitization** | [isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify) |
| **Analytics** | [Vercel Analytics](https://vercel.com/docs/analytics), [Vercel Speed Insights](https://vercel.com/docs/speed-insights) |
| **Performance** | React Compiler (Babel) |
| **Code Quality** | [Biome 2.x](https://biomejs.dev/) |
| **Build Tool** | [Turbopack](https://turbo.build/pack) (via Next.js) |

## Getting Started

### Prerequisites

- **Node.js** 24+ (LTS recommended)
- **bun** package manager (latest version)
- **PostgreSQL** database or [Neon](https://neon.tech/) database URL

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here_min_32_chars
BETTER_AUTH_URL=http://localhost:3001

# Email Service
RESEND_API_KEY=your_resend_api_key
RESEND_TO=delivered@resend.dev  # Add this to send emails to the Resend dashboard

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Error Monitoring (optional)
NEXT_PUBLIC_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-management-system
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Run database migrations**
   ```bash
   bun run migrate
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

The application will be available at [http://localhost:3001](http://localhost:3001)

### Production Build

Build for production:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

## Project Structure

```
hr-management-system/
├── app/                          # Next.js App Router pages & layouts
│   ├── (auth)/                   # Authentication routes (login, onboarding)
│   ├── (account)/                # User account & profile routes
│   │   ├── account/              # Profile management
│   │   ├── emergency-contacts/   # Emergency contacts management
│   │   ├── sessions/             # Active session management
│   │   └── appearance/           # Theme & dark mode preferences
│   ├── (root)/                   # Main application layout
│   │   ├── (dashboard)/          # User dashboard
│   │   │   ├── leave/            # Leave apply, history, view, edit
│   │   │   ├── late-arrival/     # Late arrival records
│   │   │   ├── pf/               # Provident fund balance & history
│   │   │   ├── medical-benefits/ # Medical expense & limit view
│   │   │   └── policies/         # Company policies
│   │   ├── admin/                # Admin panel & management
│   │   │   ├── users/            # User management
│   │   │   ├── balances/         # Leave balance management per employee
│   │   │   ├── leave-types/      # Leave type configuration
│   │   │   ├── policies/         # Policy creation & editing
│   │   │   ├── medical-benefits/ # Medical expense admin
│   │   │   ├── medical-limits/   # Annual medical limit configuration
│   │   │   └── pf/               # PF settings, processing, reports, summary
│   │   └── manager/              # Manager dashboard & team oversight
│   │       ├── requests/         # Pending leave requests
│   │       ├── team/             # Team member overview
│   │       └── leave/[id]/       # Individual leave review
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── users/                # User management endpoints
│   │   ├── leave/                # Leave management endpoints
│   │   ├── late-arrival/         # Late arrival tracking endpoints
│   │   ├── emergency-contacts/   # Emergency contacts endpoints
│   │   ├── policy/               # Policy management endpoints
│   │   ├── pf/                   # Provident fund endpoints
│   │   ├── medical-expense/      # Medical expense endpoints
│   │   └── medical-limit/        # Medical limit endpoints
│   ├── layout.tsx                # Root layout
│   ├── global-error.tsx          # Global error boundary
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
│
├── components/                   # Reusable React components
│   ├── ui/                       # shadcn/ui components
│   ├── pf/                       # PF-related components (settings, ledger, reports)
│   ├── LeaveForm/                # Leave application form
│   ├── LeaveRemarksForm/         # Leave remarks form
│   ├── LateArrivalForm/          # Late arrival form
│   ├── LateArrivalResolveForm/   # Late arrival resolution form
│   ├── OnboardingForm/           # User onboarding form
│   ├── ProfileForm/              # User profile form
│   ├── PolicyForm/               # Policy creation/editing form
│   ├── EmailTemplates/           # Email templates
│   ├── app-sidebar.tsx           # Main navigation sidebar
│   ├── account-sidebar.tsx       # Account settings sidebar
│   ├── leave-cards.tsx           # Leave status cards
│   ├── leave-balance-table.tsx   # Leave balances management table
│   ├── Leave-table.tsx           # Leaves list table
│   ├── late-arrival-table.tsx    # Late arrivals table
│   ├── medical-expenses-admin.tsx # Admin medical expenses table
│   ├── policy-card.tsx           # Policy display card
│   ├── user-management-table.tsx # Admin user management table
│   ├── deactivate-user-form.tsx  # User deactivation form
│   ├── set-theme.tsx             # Theme selector component
│   ├── set-mode.tsx              # Dark/light mode toggle
│   ├── login-form.tsx            # Login form
│   └── ...                       # Other utility components
│
├── db/                           # Database configuration & schema
│   ├── schema/
│   │   └── index.ts              # All table definitions (merged single-file schema)
│   ├── migrations/               # Database migrations
│   └── drizzle.ts                # Drizzle client configuration
│
├── lib/                          # Utility functions & helpers
│   ├── actions/                  # Server actions (email)
│   ├── auth/                     # Authentication utilities
│   ├── logic/                    # Business logic
│   ├── schemas/                  # Zod validation schemas
│   ├── client-utils.ts           # Client-side utilities
│   ├── utils.ts                  # General utilities
│   ├── error-handling.ts         # Error handling utilities
│   ├── errors.ts                 # Error definitions
│   └── slack-notifier.ts         # Slack error notification integration
│
├── constants/                    # Application constants
│   ├── index.ts                  # General constants
│   ├── leaves.ts                 # Leave type constants
│   ├── modals.ts                 # Modal configurations
│   └── regex.ts                  # Regular expression patterns
│
├── types/                        # TypeScript type definitions
│   ├── db.ts                     # Database types
│   ├── index.ts                  # General types
│   ├── errors.ts                 # Error types
│   └── modals.ts                 # Modal types
│
├── queries/                      # Data fetching queries
│   ├── leave.ts                  # Leave queries
│   ├── user.ts                   # User queries
│   ├── policy.ts                 # Policy queries
│   ├── late-arrival.ts           # Late arrival queries
│   ├── emergency-contact.ts      # Emergency contact queries
│   ├── leave-type.ts             # Leave type queries
│   ├── pf.ts                     # Provident fund queries
│   └── medical-expense.ts        # Medical expense queries
│
├── services/                     # Business logic services
│   ├── leave.ts                  # Leave service
│   ├── user.ts                   # User service
│   ├── policy.ts                 # Policy service
│   ├── late-arrival.ts           # Late arrival service
│   ├── emergency-contact.ts      # Emergency contact service
│   ├── leave-type.ts             # Leave type service
│   ├── leave-stats.ts            # Leave statistics service
│   ├── pf.ts                     # Provident fund service
│   └── medical-expense.ts        # Medical expense service
│
├── enum/                         # TypeScript enums
│   └── index.ts                  # Application enums
│
├── hooks/                        # Custom React hooks
│   └── use-mobile.ts             # Mobile detection hook
│
├── public/                       # Static assets
│   ├── icons/                    # Application icons
│   ├── screenshots/              # Documentation screenshots
│   ├── robots.txt                # SEO robots file
│   └── site.webmanifest          # PWA manifest
│
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── biome.json                   # Biome linter/formatter config
├── drizzle.config.ts            # Drizzle ORM configuration
├── migrate.ts                   # Migration runner script
├── components.json              # UI components registry
└── package.json                 # Project dependencies
```

## Database Schema

The application uses PostgreSQL with the following key tables:

### Authentication & Users
- **account** - Authentication provider accounts for OAuth/integrated auth
- **session** - User session management
- **user** - Core user accounts from better-auth
- **verification** - Email verification and password reset tokens
- **user_detail** - Extended user profile information (employee ID, designation, salary, currency, CNIC)

### Leave Management
- **leave** - Leave requests with status (pending, accepted, approved, rejected, suspended, late)
- **leave_remark** - Manager remarks and communication on leave requests
- **leave_type** - Admin-configurable leave types with paid/unpaid classification and per-employee balances

### Attendance & Punctuality
- **late_arrival** - Records of late arrivals with timestamps; links to a resolving leave when applicable

### Provident Fund
- **pf_settings** - Per-employee PF configuration (employee amount, company contribution type and amount, effective date)
- **pf_ledger** - Full transaction ledger (monthly contributions and withdrawals) per employee

### Medical Benefits
- **medical_limit** - Annual medical expense limit (one record per year, applies to all employees)
- **medical_expense** - Monthly medical expense records per employee

### Administration
- **policy** - Company policies with rich text content
- **emergency_contact** - Employee emergency contacts

### Key Features
- Automatic relationship management and constraints
- Timestamps (`created_at`, `updated_at`) on all tables
- Status enums for workflow management
- Cascading deletes for data integrity
- Unique indexes to prevent duplicate monthly PF and medical records

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server on port 3001 with Turbopack |
| `bun run build` | Build for production (includes migration pre-step) |
| `bun run start` | Start production server on port 3001 |
| `bun run reinstall` | Remove node_modules & lock file, then reinstall |
| `bun run lint` | Lint and fix code using Biome |
| `bun run format` | Format code using Biome |
| `bun run generate` | Generate Drizzle ORM migrations |
| `bun run migrate` | Run pending database migrations |
| `bun run auth` | Generate authentication schema with better-auth CLI |
| `bun run studio` | Launch Drizzle Studio for interactive database management |

## API Endpoints

### Authentication
- `POST /api/auth/*` - better-auth handling (sign in, sign up, sign out, OAuth, etc.)

### User Management
- `GET /api/users` - List all users (admin)
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user information
- `POST /api/users/onboard` - Complete user onboarding

### Leave Management
- `GET /api/leave` - List leave requests
- `POST /api/leave` - Submit leave request
- `GET /api/leave/[id]` - Get leave request details
- `PUT /api/leave/[id]` - Update leave request
- `POST /api/leave/approve` - Approve a leave request
- `POST /api/leave/reject` - Reject a leave request
- `POST /api/leave/suspend` - Suspend a leave request
- `POST /api/leave/remark` - Add remark to leave request
- `PUT /api/leave/remark/[id]` - Update a remark
- `GET /api/leave/type` - List leave types
- `POST /api/leave/type` - Create leave type
- `PUT /api/leave/type/[id]` - Update leave type

### Late Arrival Tracking
- `GET /api/late-arrival` - List late arrival records
- `POST /api/late-arrival` - Record late arrival
- `PUT /api/late-arrival/[id]` - Update late arrival record
- `POST /api/late-arrival/resolve` - Resolve a late arrival

### Emergency Contacts
- `GET /api/emergency-contacts` - List emergency contacts
- `POST /api/emergency-contacts` - Create emergency contact
- `PUT /api/emergency-contacts/[id]` - Update emergency contact
- `DELETE /api/emergency-contacts/[id]` - Delete emergency contact
- `POST /api/emergency-contacts/set-primary` - Set a contact as primary

### Policy Management
- `GET /api/policy` - List active policies
- `POST /api/policy` - Create new policy
- `GET /api/policy/[id]` - Get policy details
- `PUT /api/policy/[id]` - Update policy

### Provident Fund
- `GET /api/pf/settings` - List all PF settings
- `POST /api/pf/settings` - Create PF settings for a user
- `PUT /api/pf/settings/[id]` - Update PF settings
- `GET /api/pf/ledger` - Get PF ledger entries
- `PUT /api/pf/ledger/[id]` - Update a ledger entry
- `POST /api/pf/process` - Run monthly PF processing
- `GET /api/pf/balance` - Get PF balance summary

### Medical Benefits
- `GET /api/medical-expense` - List medical expenses
- `POST /api/medical-expense` - Create medical expense entry
- `PUT /api/medical-expense/[id]` - Update a medical expense
- `POST /api/medical-expense/upsert` - Upsert monthly expense record
- `GET /api/medical-limit` - List annual medical limits
- `POST /api/medical-limit` - Create annual medical limit
- `PUT /api/medical-limit/[id]` - Update a medical limit

## Authentication & Authorization

### Authentication Flow
1. **Login**: Users authenticate via email/password or Google OAuth
2. **Session Management**: Sessions managed by better-auth with PostgreSQL adapter
3. **Authorization**: Role-based access control (RBAC) for User, Manager, Admin
4. **Token Handling**: Secure session tokens stored server-side

### User Roles

| Role | Permissions |
|------|-------------|
| **User** | Submit leave requests, view own leaves, view own PF & medical benefits, update profile, manage emergency contacts |
| **Manager** | View team dashboard, approve/reject leave, add remarks, track late arrivals |
| **Admin** | Full system access, user management, policy creation, leave balance management, PF processing, medical limit configuration |

## Email Notifications

The application uses **Resend** to send email notifications for:
- Leave request submissions

## Error Monitoring

Server-side errors are reported to a **Slack** channel via a webhook. Set `NEXT_PUBLIC_SLACK_WEBHOOK_URL` to enable this. Errors include the environment name and a JSON-formatted stack trace.

## Performance Optimizations

- **React Compiler**: Automated memoization and optimization
- **Turbopack**: Next.js bundler for faster builds
- **Vercel Speed Insights**: Real-time performance monitoring
- **Vercel Analytics**: Page-view and usage analytics
- **Image Optimization**: Next.js Image component with Google auth
- **Code Splitting**: Automatic route-based code splitting

## Development Guidelines

### Code Quality
- Use **Biome** for linting and formatting:
  ```bash
  bun run lint   # Check and fix linting issues
  bun run format # Format code
  ```
- Follow TypeScript strict mode
- Use Zod for runtime validation

### Forms & Validation
- All forms use `react-hook-form` with Zod schemas
- Schemas located in [lib/schemas](lib/schemas)
- Form components are in [components/](components) with corresponding subdirectories

### Database Modifications
1. Update schema in [db/schema/index.ts](db/schema/index.ts)
2. Generate migration: `bun run generate`
3. Review migration file
4. Apply migration: `bun run migrate`

## Troubleshooting

### Common Issues

**Port 3001 already in use**
```bash
# Kill process on port 3001 (Linux/Mac)
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Database migration fails**
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database permissions

**Build fails after schema changes**
```bash
# Regenerate and migrate
bun run generate
bun run migrate
bun run build
```

**better-auth configuration issues**
```bash
# Regenerate auth schema
bun run auth
bun run migrate
```

**Clean reinstall**
```bash
bun run reinstall
```

## Contributing

For internal development:
1. Create a feature branch from `main`
2. Follow TypeScript and Biome standards
3. Test changes thoroughly
4. Commit with clear messages
5. Create pull request for review

## Support & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/get-started/neon-new)
- [better-auth Documentation](https://better-auth.com/docs/introduction)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
