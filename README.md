# Tipped

[![CI Status](https://woodpecker.i258.net/api/badges/2/status.svg)](https://woodpecker.i258.net/repos/2)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Setup

This project uses [T3 Env](https://env.t3.gg/) for type-safe environment variable validation. Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/database_name"

# Environment
NODE_ENV="development"

# Optional: Skip environment validation (for CI/CD)
# SKIP_ENV_VALIDATION="true"
```

## Getting Started

First, set up your environment variables as described above, then run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Database

This project uses [Drizzle ORM](https://orm.drizzle.team/) with MySQL. Available database commands:

```bash
# Push schema changes to database
pnpm db:push

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

## CI/CD

This project uses [Woodpecker CI](https://woodpecker-ci.org/) for continuous integration. The CI pipeline is configured in `.woodpecker/ci.yml` and includes:

- **Testing**: Runs Vitest tests on every push and pull request
- **Slack Notifications**: Sends build status notifications to Slack (optional)

### Setup

The CI pipeline will run automatically on pushes and pull requests. To enable Slack notifications (optional):

1. Create a Slack webhook URL in your Slack workspace
2. Add the following secret to your Woodpecker CI repository settings:
   - `slack-webhook-url`: Your Slack webhook URL for notifications

If the Slack webhook secret is not configured, the pipeline will still run tests but skip Slack notifications.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing with React Testing Library. See the [testing documentation](src/tests/README.md) for detailed information about the testing setup.

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
