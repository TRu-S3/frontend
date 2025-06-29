import { NextResponse } from 'next/server'

const AI_AGENT_BASE_URL = 'https://ai-agent-696136807010.asia-northeast1.run.app'

export async function GET() {
  try {
    const response = await fetch(`${AI_AGENT_BASE_URL}/api/workflows/integratedWorkflow/runs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to get runs: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling ai-agent:', error)
    return NextResponse.json(
      { error: 'Failed to call ai-agent' },
      { status: 500 }
    )
  }
}