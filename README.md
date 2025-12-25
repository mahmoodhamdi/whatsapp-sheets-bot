# WhatsApp Bot - Auto-Reply & Google Sheets Integration

A smart WhatsApp auto-reply bot with Google Sheets integration, built with Next.js 16. Features include automated responses based on customizable rules, contact management, message logging, and data synchronization with Google Sheets.

## Features

- **Auto-Reply Rules**: Create rules with exact match, contains, starts with, or regex patterns
- **WhatsApp Integration**: Connect via QR code scanning using Baileys
- **Google Sheets Sync**: Automatically sync contacts and messages to Google Sheets
- **Multi-language Support**: Arabic (default) and English with RTL support
- **Dashboard**: Real-time statistics and analytics
- **Contact Management**: View and manage all WhatsApp contacts
- **Message History**: Complete log of all incoming and outgoing messages

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **WhatsApp**: @whiskeysockets/baileys
- **Authentication**: NextAuth v5 (Credentials provider)
- **Internationalization**: next-intl
- **UI**: Tailwind CSS v4, shadcn/ui components
- **Testing**: Vitest (unit), Playwright (E2E)

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-sheets-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) and login with:
   - Email: `admin@example.com`
   - Password: `password123`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `WHATSAPP_SESSION_PATH` | Path to store WhatsApp sessions | No (default: `./sessions`) |
| `GOOGLE_SHEETS_CREDENTIALS` | Base64 encoded service account JSON | No |
| `GOOGLE_SHEET_ID` | Target Google Sheets spreadsheet ID | No |
| `ADMIN_EMAIL` | Initial admin email for seeding | No |
| `ADMIN_PASSWORD` | Initial admin password for seeding | No |

## Running with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Open Prisma Studio |

## Google Sheets Setup

1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create a service account and download the JSON key
4. Base64 encode the JSON: `cat service-account.json | base64`
5. Set `GOOGLE_SHEETS_CREDENTIALS` with the base64 string
6. Set `GOOGLE_SHEET_ID` with your spreadsheet ID
7. Share the spreadsheet with the service account email

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Contacts
- `GET /api/contacts` - List contacts (paginated, searchable)
- `GET /api/contacts/[id]` - Get contact details with messages
- `DELETE /api/contacts/[id]` - Delete contact

### Messages
- `GET /api/messages` - List messages
- `POST /api/messages/send` - Send a message

### Rules
- `GET /api/rules` - List rules
- `POST /api/rules` - Create rule
- `PUT /api/rules/[id]` - Update rule
- `DELETE /api/rules/[id]` - Delete rule
- `PATCH /api/rules/[id]/toggle` - Toggle rule active status

### WhatsApp
- `GET /api/whatsapp/status` - Get connection status
- `POST /api/whatsapp/connect` - Initialize connection
- `POST /api/whatsapp/disconnect` - Disconnect

### Google Sheets
- `GET /api/sheets/status` - Get sync status
- `POST /api/sheets/sync` - Trigger sync
- `GET /api/sheets/logs` - Get sync logs

### Analytics
- `GET /api/analytics/overview` - Dashboard statistics
- `GET /api/analytics/messages` - Message analytics
- `GET /api/analytics/rules` - Rule performance

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login)
│   ├── (dashboard)/      # Dashboard pages
│   └── api/              # API routes
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── rules/            # Rule form components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── google-sheets/    # Google Sheets integration
│   └── whatsapp/         # WhatsApp client
└── i18n/                 # Internationalization config
```

## License

MIT
