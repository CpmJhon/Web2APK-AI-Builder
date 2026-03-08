// api/scan-website/route.ts
import { NextResponse } from 'next/server'
import { analyzeWebsite } from '@/lib/website-analyzer'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    const analysis = await analyzeWebsite(url)
    
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Website analysis error:', error)
    
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    )
  }
}