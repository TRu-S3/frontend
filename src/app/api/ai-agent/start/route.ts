import { NextRequest, NextResponse } from 'next/server'

const AI_AGENT_BASE_URL = 'https://ai-agent-696136807010.asia-northeast1.run.app'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const runId = searchParams.get('runId')
    const body = await request.json()

    if (!runId) {
      return NextResponse.json(
        { error: 'runId is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${AI_AGENT_BASE_URL}/api/workflows/integratedWorkflow/start?runId=${runId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to start workflow: ${response.status}` },
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