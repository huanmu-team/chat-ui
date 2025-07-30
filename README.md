# Chat UI - Agent Comparison Dashboard

A lightweight Next.js dashboard for comparing two LangGraph agents side by side.

## Features

- **Dual Chat Interface**: Compare two agents simultaneously
- **Configurable API Settings**: Easy setup for API keys and thread IDs  
- **Real-time Messaging**: Live chat with both agents
- **Production Ready**: Optimized for Vercel deployment
- **TypeScript**: Full type safety
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

3. **Configure agents**:
   - Click the settings icon on each chat panel
   - Enter your LangGraph API key and thread ID
   - Set agent names for easy identification

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Optional: Set default values
NEXT_PUBLIC_LANGGRAPH_API_URL=https://api.langchain.com
NEXT_PUBLIC_DEFAULT_AGENT_1_NAME=Agent 1
NEXT_PUBLIC_DEFAULT_AGENT_2_NAME=Agent 2
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
3. Deploy automatically

### Manual Deployment

```bash
bun build
```

The built files will be in the `.next` directory.

## API Integration

The dashboard integrates with LangGraph APIs. Ensure your LangGraph agents are deployed and accessible via their API endpoints.

### API Configuration

Each chat panel requires:
- **API Key**: Your LangGraph API authentication key
- **Thread ID**: Unique identifier for the conversation thread
- **Agent Name**: Display name for the agent

## Project Structure

```
├── app/                 # Next.js app router
├── components/          # React components
├── lib/                 # Utility functions and API clients
└── types/              # TypeScript type definitions
```

## Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [Bun](https://bun.sh/) - Package manager and runtime