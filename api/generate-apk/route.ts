// api/generate-apk/route.ts
import { NextResponse } from 'next/server'
import { APKGenerator } from '@/lib/apk-generator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.url || !body.appName || !body.packageName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create APK generator instance
    const generator = new APKGenerator({
      url: body.url,
      appName: body.appName,
      packageName: body.packageName,
      themeColor: body.themeColor || '#6366f1',
      features: {
        fileDownload: body.enableFileDownload || false,
        fileUpload: body.enableFileUpload || false,
        fullscreenVideo: body.enableFullscreenVideo || false,
        pushNotifications: body.enablePushNotifications || false,
        offlineMode: body.enableOfflineMode || false,
      }
    })
    
    // Generate Android project
    await generator.generateProject()
    
    // Build APK or create ZIP based on request
    if (body.buildType === 'apk') {
      const apkBuffer = await generator.buildAPK()
      
      return new NextResponse(apkBuffer, {
        headers: {
          'Content-Type': 'application/vnd.android.package-archive',
          'Content-Disposition': `attachment; filename="${body.appName}.apk"`,
        },
      })
    } else {
      const zipBuffer = await generator.createZip()
      
      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${body.appName}.zip"`,
        },
      })
    }
  } catch (error) {
    console.error('APK generation error:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate APK' },
      { status: 500 }
    )
  }
}