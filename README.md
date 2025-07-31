# Chat UI - Agent Comparison Dashboard

A lightweight Next.js application for comparing two LangGraph agents side by side. This lightweight dashboard allows users to chat with two different agents simultaneously to compare their performance and responses.

## Features

- **Dual Chat Interface**: Compare two agents simultaneously
- **Server-Side Architecture**: API keys and sensitive data stay on server
- **Automatic Thread Management**: No manual configuration needed
- **Real-time Messaging**: Live chat with both agents
- **Responsive Design**: Works on desktop and mobile

## Quick Start

1. **Install dependencies with bun**:
   ```bash
   bun install
   ```

2. **Start development server**:
   ```bash
   bun dev
   ```

3. **Start chatting**:
   - Click "New Thread" button to start a conversation
   - Send messages to compare both agents
   - Thread IDs are managed automatically

## Environment Variables

Copy `.env.local.example` to `.env.local` with your server-side configure:

```bash
# Set server-side only (required)
AGENT_1_API_KEY=your_agent_1_api_key_here
AGENT_1_BASE_URL=https://your-agent-1-deployment.us.langgraph.app
AGENT_1_ID=your_agent_1_id_here

AGENT_2_API_KEY=your_agent_2_api_key_here
AGENT_2_BASE_URL=https://your-agent-2-deployment.us.langgraph.app
AGENT_2_ID=your_agent_2_id_here

# Optional client defaults
NEXT_PUBLIC_AGENT_1_NAME=Agent1
NEXT_PUBLIC_AGENT_2_NAME=Agent2
NEXT_PUBLIC_MAX_MESSAGES=100
```

## Development Commands

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun type-check` - Run TypeScript checks

## Deployment

### Vercel (Recommended)

1. Push to GitHub repository
2. Import project in Vercel dashboard
3. Add environment variables in Vercel settings
4. Deploy automatically


## Security Architecture

The application uses a server-side architecture:

### Server-Side API Routes
- `/api/agents/[agentId]/threads` - Creates new threads
- `/api/agents/[agentId]/threads/[threadId]/messages` - Sends messages
- All sensitive operations happen server-side
- Zero risk of API key exposure

### Client-Side Security
- No API keys in browser or client bundle
- Thread IDs managed automatically
- Clean separation of concerns

## Project Structure

```
├── app/                           # Next.js app router
│   ├── api/agents/[agentId]/      # Server-side API routes
│   │   ├── threads/route.ts       # Create new threads
│   │   └── threads/[threadId]/
│   │       └── messages/route.ts  # Send messages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main dashboard page
├── components/                    
│   ├── ChatMessage.tsx           # Individual message 
│   ├── ChatInput.tsx             # Message input 
│   ├── ChatPanel.tsx             # Complete chat interface panel
│   └── SimultaneousInput.tsx     # Input for both agents
├── lib/                          # Utility functions
│   ├── api.ts                    # Secure client API
│   └── config.ts                 # Configuration helpers
└── types/                        # TypeScript definitions
    └── index.ts                  # Core types
```

## Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [Bun](https://bun.sh/) - Package manager and runtime