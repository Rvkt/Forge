# Forge

> A production-oriented mobile and backend engineering laboratory.

Forge is a monorepo where I build and evolve the same product across multiple clients and a backend:

- **React Native** — primary mobile client
- **Flutter** — secondary mobile client
- **Node.js + TypeScript + NestJS** — backend
- **PostgreSQL** — primary database

The purpose of Forge is not to build another tutorial project.

It is a long-running engineering project for practicing:

- Production React Native development
- TypeScript
- Backend architecture
- API design
- PostgreSQL and database design
- Mobile/backend integration
- Authentication and authorization
- Offline synchronization
- Performance optimization
- Testing
- Observability
- CI/CD
- System design
- Distributed-systems concepts

---

## Architecture

```text
                         ┌─────────────────────┐
                         │   React Native App  │
                         │   TypeScript        │
                         └──────────┬──────────┘
                                    │
                                    │
                         ┌──────────▼──────────┐
                         │                     │
                         │     NestJS API      │
                         │   Node.js + TS       │
                         │                     │
                         └──────────┬──────────┘
                                    │
                                    │
                         ┌──────────▼──────────┐
                         │    PostgreSQL       │
                         └─────────────────────┘
                                    ▲
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         │    Flutter App      │
                         │       Dart          │
                         │                     │
                         └─────────────────────┘
```

```text
forge/
│
├── apps/
│   ├── mobile-rn/          # React Native application
│   └── mobile-flutter/     # Flutter application
│
├── backend/
│   └── api/                # NestJS backend
│
├── packages/               # Shared JS/TS packages
│
├── infra/                  # Infrastructure configuration
│
├── docs/                   # Architecture and engineering documentation
│
├── docker-compose.yml      # Local infrastructure (PostgreSQL)
├── package.json            # Root workspace configuration
├── pnpm-workspace.yaml     # pnpm workspace definition
├── turbo.json              # Turborepo configuration
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 24)
- [pnpm](https://pnpm.io/) (>= 10)
- [Docker & Docker Compose](https://www.docker.com/)

### 1. Clone & Install Dependencies

```bash
git clone git@github.com:Rvkt/Forge.git
cd Forge
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Start Local Infrastructure

Start the PostgreSQL database:

```bash
docker compose up -d
```

### 4. Run Development Services

Run all workspace applications and services in development mode via Turborepo:

```bash
pnpm dev
```

Or run the backend API specifically:

```bash
pnpm --filter api dev
```

---

## Workspace Scripts

| Command       | Description                                                |
| ------------- | ---------------------------------------------------------- |
| `pnpm dev`    | Run all applications and services concurrently in dev mode |
| `pnpm build`  | Build all workspace packages and apps                      |
| `pnpm test`   | Run test suites across the monorepo                        |
| `pnpm lint`   | Run ESLint across all workspace packages                   |
| `pnpm format` | Format the entire codebase using Prettier                  |

---

## Monorepo Layout

- `apps/` — Client applications (React Native, Flutter)
- `backend/` — Server-side services (NestJS REST / GraphQL API)
- `packages/` — Shared libraries, shared types, UI kits, and utility packages
- `infra/` — Deployment manifests, Terraform, Helm, or CI/CD pipelines
- `docs/` — System design documents, RFCs, and architecture notes
