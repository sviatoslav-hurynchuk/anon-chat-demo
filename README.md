# Anonymous Chat Demo

A real-time anonymous chat application. No sign-up required — each browser tab gets its own anonymous identity.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Auth**: Firebase Anonymous Authentication
- **Database**: Firebase Realtime Database
- **Realtime**: Firebase Realtime DB SDK (WebSocket under the hood)
- **Monorepo**: npm workspaces

## Architecture

```
Browser Tab 1 (UID: abc)  ──┐
                             ├── POST /api/messages ──→ Express (validate + rate limit)
Browser Tab 2 (UID: xyz)  ──┘                              │
       ↑                                                    ↓
       └──── WebSocket (Firebase SDK) ←──── Firebase Realtime DB
```

- **Write path**: Client → Express backend (validates, sanitizes, rate limits) → Firebase Admin SDK → Realtime DB
- **Read path**: Firebase Realtime DB → WebSocket push → Client (via `onValue()` listener)

## Prerequisites

1. [Node.js](https://nodejs.org/) v18+
2. A Firebase project with:
   - **Anonymous Authentication** enabled
   - **Realtime Database** created
   - A **Service Account key** (JSON) for the backend

## Setup

```bash
# 1. Clone and install
git clone https://github.com/sviatoslav-hurynchuk/anon-chat-demo.git
cd anon-chat-demo
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Firebase credentials

# 3. Place your service account key
# Download from: Firebase Console → ⚙️ Project Settings → Service Accounts
# Save as ./service-account.json (already in .gitignore)

# 4. Start development servers
npm run dev
# Server: http://localhost:3001
# Client: http://localhost:4200
```

## Testing Multi-Tab

Open `http://localhost:4200` in multiple browser tabs. Each tab gets its own anonymous UID (via `sessionStorage` persistence), so messages from one tab show a "you" badge, while messages from other tabs don't.

## Project Structure

```
anon-chat-demo/
├── packages/shared/        # Shared TypeScript types
├── server/                 # Express backend (POST /api/messages)
│   └── src/
│       ├── index.ts        # Express app + rate limiting
│       ├── firebase-admin.ts
│       ├── middleware/auth.ts
│       └── routes/messages.ts
└── client/                 # React SPA
    └── src/
        ├── firebase.ts     # Client SDK + sessionPersistence
        ├── hooks/          # useAuth, useMessages
        ├── components/     # ChatRoom, MessageInput, MessageList, MessageItem
        └── utils/          # timeAgo
```

## Environment Variables

See [.env.example](.env.example) for the full list.

## License

MIT
