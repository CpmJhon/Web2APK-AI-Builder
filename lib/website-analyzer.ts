// lib/website-analyzer.ts
import { JSDOM } from 'jsdom'

export async function analyzeWebsite(url: string) {
  try {
    // Fetch website content
    const response = await fetch(url)
    const html = await response.text()
    
    // Parse with JSDOM
    const dom = new JSDOM(html)
    const document = dom.window.document
    
    // Extract metadata
    const title = document.querySelector('title')?.textContent || ''
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    
    // Detect technologies
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src)
    const hasReact = scripts.some(src => src.includes('react'))
    const hasVue = scripts.some(src => src.includes('vue'))
    const hasAngular = scripts.some(src => src.includes('angular'))
    
    // Detect downloadable content
    const links = Array.from(document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".zip"]'))
    
    // Detect internal pages
    const internalLinks = Array.from(document.querySelectorAll('a[href^="/"]'))
      .map(a => a.getAttribute('href'))
      .filter((href, index, self) => self.indexOf(href) === index)
    
    // Generate app name suggestion
    const suggestedName = title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(' ')
      .slice(0, 3)
      .join(' ')
    
    return {
      title,
      description,
      suggestedName,
      technologies: {
        react: hasReact,
        vue: hasVue,
        angular: hasAngular,
      },
      downloadableContent: links.length,
      internalPages: internalLinks.slice(0, 10),
      tags: generateTags(title, description),
      analysis: `Found ${internalLinks.length} internal pages and ${links.length} downloadable files.`,
    }
  } catch (error) {
    console.error('Analysis error:', error)
    throw new Error('Failed to analyze website')
  }
}

function generateTags(title: string, description: string): string[] {
  const tags: string[] = []
  const text = `${title} ${description}`.toLowerCase()
  
  const tagKeywords = {
    'ecommerce': ['shop', 'store', 'buy', 'product', 'cart'],
    'news': ['news', 'article', 'blog', 'post'],
    'social': ['social', 'share', 'connect', 'friend'],
    'business': ['business', 'company', 'corporate', 'enterprise'],
    'education': ['learn', 'course', 'education', 'school'],
  }
  
  Object.entries(tagKeywords).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag)
    }
  })
  
  return tags.slice(0, 5)
}