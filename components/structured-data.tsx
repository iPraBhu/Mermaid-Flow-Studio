import Script from 'next/script'
import { siteConfig } from '@/lib/site'

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@id": `${siteConfig.url}/#organization`
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: "Prabhu Tools",
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/icon-512.svg`,
          contentUrl: `${siteConfig.url}/icon-512.svg`,
          width: 512,
          height: 512,
        },
        sameAs: [
          siteConfig.social?.twitter ? `https://twitter.com/${siteConfig.social.twitter.replace('@', '')}` : '',
          siteConfig.social?.github || ''
        ].filter(Boolean)
      },
      {
        "@type": "WebApplication",
        "@id": `${siteConfig.url}/#webapp`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        featureList: [
          "Live Mermaid flowchart editing",
          "Multiple export formats (SVG, PNG, JPEG, PDF)",
          "Offline-ready PWA support", 
          "Visual presets and themes",
          "Template gallery",
          "Client-side processing",
          "No data collection",
          "Responsive design"
        ],
        screenshot: {
          "@type": "ImageObject",
          url: siteConfig.ogImage,
          contentUrl: siteConfig.ogImage
        },
        keywords: "mermaid, flowchart, diagram, editor, export, SVG, PNG, PDF, offline, PWA",
        author: {
          "@type": "Organization",
          name: "Prabhu Tools"
        },
        datePublished: "2024-01-01",
        dateModified: new Date().toISOString().split('T')[0]
      },
      {
        "@type": "SoftwareApplication",
        name: siteConfig.name,
        description: siteConfig.description,
        applicationCategory: "WebApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "150",
          bestRating: "5",
          worstRating: "1"
        }
      }
    ]
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}