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

// POST /api/agents/[agentId]/threads - Create new thread
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const config = getAgentConfig(agentId);
    
    if (!config || !config.apiKey || !config.baseUrl || !config.agentId) {
      return NextResponse.json(
        { error: 'Agent configuration not found or incomplete' },
        { status: 404 }
      );
    }

    const response = await fetch(`${config.baseUrl}/threads`, {
      method: 'POST',
      headers: {
        'X-API-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadata: {
          assistant_id: config.agentId
        },
        if_exists: "raise"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to create thread: ${response.status} ${response.statusText} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const threadId = data.thread_id;

    if (!threadId) {
      return NextResponse.json(
        { error: 'No thread ID returned from API' },
        { status: 500 }
      );
    }

    return NextResponse.json({ threadId });

  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}