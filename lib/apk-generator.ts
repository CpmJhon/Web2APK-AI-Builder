// lib/apk-generator.ts
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import AdmZip from 'adm-zip'

const execAsync = promisify(exec)

interface AppConfig {
  url: string
  appName: string
  packageName: string
  themeColor: string
  features: {
    fileDownload: boolean
    fileUpload: boolean
    fullscreenVideo: boolean
    pushNotifications: boolean
    offlineMode: boolean
  }
  icon?: Buffer
  splashScreen?: Buffer
}

export class APKGenerator {
  private config: AppConfig
  private projectPath: string

  constructor(config: AppConfig) {
    this.config = config
    this.projectPath = path.join('/tmp', `android-project-${Date.now()}`)
  }

  async generateProject(): Promise<string> {
    // Create project structure
    await this.createDirectoryStructure()
    
    // Generate Android files
    await this.generateManifest()
    await this.generateMainActivity()
    await this.generateGradleFiles()
    await this.generateResources()
    
    // Copy assets
    if (this.config.icon) {
      await this.saveIcon()
    }
    if (this.config.splashScreen) {
      await this.saveSplashScreen()
    }
    
    return this.projectPath
  }

  async buildAPK(): Promise<Buffer> {
    // Build APK using Gradle
    await execAsync('./gradlew assembleRelease', { cwd: this.projectPath })
    
    // Read generated APK
    const apkPath = path.join(this.projectPath, 'app/build/outputs/apk/release/app-release.apk')
    const apkBuffer = await fs.readFile(apkPath)
    
    return apkBuffer
  }

  async createZip(): Promise<Buffer> {
    const zip = new AdmZip()
    zip.addLocalFolder(this.projectPath)
    return zip.toBuffer()
  }

  private async createDirectoryStructure() {
    const dirs = [
      'app/src/main/java/com/generated/app',
      'app/src/main/res/layout',
      'app/src/main/res/drawable',
      'app/src/main/res/mipmap-hdpi',
      'app/src/main/res/mipmap-mdpi',
      'app/src/main/res/mipmap-xhdpi',
      'app/src/main/res/mipmap-xxhdpi',
      'app/src/main/res/values',
      'gradle/wrapper',
    ]
    
    for (const dir of dirs) {
      await fs.mkdir(path.join(this.projectPath, dir), { recursive: true })
    }
  }

  private async generateManifest() {
    const packageName = this.config.packageName
    const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}">
    
    <uses-permission android:name="android.permission.INTERNET" />
    ${this.config.features.fileDownload ? '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />' : ''}
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${this.config.appName}"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
    
    await fs.writeFile(
      path.join(this.projectPath, 'app/src/main/AndroidManifest.xml'),
      manifest
    )
  }

  private async generateMainActivity() {
    const activity = `package com.generated.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.DownloadListener;
import android.webkit.WebChromeClient;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.net.Uri;
import android.webkit.ValueCallback;
import android.webkit.PermissionRequest;
import android.Manifest;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private ValueCallback<Uri[]> uploadMessage;
    private static final int FILE_CHOOSER_REQUEST_CODE = 1;
    private static final int PERMISSION_REQUEST_CODE = 2;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        ${this.config.features.fileDownload ? 'webSettings.setAllowFileAccess(true);' : ''}
        ${this.config.features.fileUpload ? 'webSettings.setAllowContentAccess(true);' : ''}
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    view.loadUrl(url);
                    return true;
                }
                return false;
            }
        });
        
        ${this.config.features.fullscreenVideo ? `
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                request.grant(request.getResources());
            }
        });` : ''}
        
        ${this.config.features.fileDownload ? `
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            Uri uri = Uri.parse(url);
            android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, uri);
            startActivity(intent);
        });` : ''}
        
        webView.loadUrl("${this.config.url}");
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
    
    ${this.config.features.fileUpload ? `
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (uploadMessage != null) {
                Uri[] results = null;
                if (resultCode == RESULT_OK) {
                    if (data != null) {
                        String dataString = data.getDataString();
                        if (dataString != null) {
                            results = new Uri[]{Uri.parse(dataString)};
                        }
                    }
                }
                uploadMessage.onReceiveValue(results);
                uploadMessage = null;
            }
        }
    }` : ''}
}`
    
    await fs.writeFile(
      path.join(this.projectPath, 'app/src/main/java/com/generated/app/MainActivity.java'),
      activity
    )
  }

  private async generateGradleFiles() {
    // settings.gradle
    const settings = `include ':app'`
    await fs.writeFile(
      path.join(this.projectPath, 'settings.gradle'),
      settings
    )
    
    // build.gradle (project)
    const projectGradle = `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`
    
    await fs.writeFile(
      path.join(this.projectPath, 'build.gradle'),
      projectGradle
    )
    
    // build.gradle (app)
    const appGradle = `apply plugin: 'com.android.application'

android {
    compileSdk 33
    defaultConfig {
        applicationId "${this.config.packageName}"
        minSdk 21
        targetSdk 33
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
    implementation 'androidx.webkit:webkit:1.6.1'
}`
    
    await fs.writeFile(
      path.join(this.projectPath, 'app/build.gradle'),
      appGradle
    )
  }

  private async generateResources() {
    // styles.xml
    const styles = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="colorPrimary">${this.config.themeColor}</item>
        <item name="colorPrimaryDark">${this.config.themeColor}</item>
        <item name="colorAccent">${this.config.themeColor}</item>
        <item name="android:windowBackground">@color/background</item>
    </style>
</resources>`
    
    await fs.writeFile(
      path.join(this.projectPath, 'app/src/main/res/values/styles.xml'),
      styles
    )
    
    // colors.xml
    const colors = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="background">${this.config.themeColor}</color>
</resources>`
    
    await fs.writeFile(
      path.join(this.projectPath, 'app/src/main/res/values/colors.xml'),
      colors
    )
    
    // activity_main.xml
    const layout = `<?xml version="1.0" encoding="utf-8"?>
<WebView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/webview"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />`
    
    await fs.writeFile(
      path.join(this.projectPath, 'app/src/main/res/layout/activity_main.xml'),
      layout
    )
  }

  private async saveIcon() {
    if (!this.config.icon) return
    
    const sizes = [48, 72, 96, 144, 192]
    for (const size of sizes) {
      await fs.writeFile(
        path.join(this.projectPath, `app/src/main/res/mipmap-${size}dpi/ic_launcher.png`),
        this.config.icon
      )
    }
  }

  private async saveSplashScreen() {
    if (!this.config.splashScreen) return
    
    await fs.writeFile(
      path.join(this.projectPath, 'app/src/main/res/drawable/splash_screen.png'),
      this.config.splashScreen
    )
  }
}