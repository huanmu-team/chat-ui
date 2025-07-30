import { NextRequest, NextResponse } from 'next/server';

// Server-side configuration
const getAgentConfig = (agentId: string) => {
  if (agentId === 'agent1') {
    return {
      apiKey: process.env.AGENT_1_API_KEY,
      baseUrl: process.env.AGENT_1_BASE_URL,
      agentId: process.env.AGENT_1_ID,
    };
  } else if (agentId === 'agent2') {
    return {
      apiKey: process.env.AGENT_2_API_KEY,
      baseUrl: process.env.AGENT_2_BASE_URL,
      agentId: process.env.AGENT_2_ID,
    };
  }
  return null;
};

// POST /api/agents/[agentId]/threads/[threadId]/messages - Send message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string; threadId: string }> }
) {
  try {
    const { agentId, threadId } = await params;
    const config = getAgentConfig(agentId);
    
    if (!config || !config.apiKey || !config.baseUrl || !config.agentId) {
      return NextResponse.json(
        { error: 'Agent configuration not found or incomplete' },
        { status: 404 }
      );
    }

    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${config.baseUrl}/threads/${threadId}/runs/wait`, {
      method: 'POST',
      headers: {
        'X-API-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistant_id: config.agentId,
        input: {
          messages: [
            {
              role: 'user',
              content: content,
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to send message: ${response.status} ${response.statusText} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const lastMessage = data.last_message;

    if (!lastMessage) {
      return NextResponse.json(
        { error: 'No response message received from agent' },
        { status: 500 }
      );
    }

    // Return the message in the format expected by the client
    return NextResponse.json({
      id: Date.now().toString(),
      content: typeof lastMessage === 'string' ? lastMessage : lastMessage.content || 'No response',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}