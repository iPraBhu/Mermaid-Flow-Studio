'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
  variant?: 'default' | 'minimal' | 'text-only' | 'hero'
  textSize?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Logo({ 
  className, 
  size = 56, 
  showText = true, 
  variant = 'default',
  textSize = 'md'
}: LogoProps) {
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  }

  const subtitleSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  if (variant === 'text-only') {
    return (
      <div className={cn("flex items-center", className)}>
        <div className={cn("font-semibold tracking-tight", textSizeClasses[textSize])}>
          Mermaid Flow Studio
        </div>
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <div className={cn("flex items-center gap-6", className)}>
        <div className="relative flex-shrink-0">
          <Image
            src="/logo-hero.svg"
            alt="Mermaid Flow Studio"
            width={size * 2}
            height={Math.round(size * 1.2)}
            className="rounded-3xl"
          />
        </div>
        {showText && (
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mermaid Flow Studio</h1>
            <p className="text-lg text-[var(--muted-foreground)]">
              Professional Mermaid diagram editor
            </p>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="relative flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="Mermaid Flow Studio"
            width={size}
            height={size}
            className="rounded-2xl"
          />
        </div>
        {showText && (
          <div className={cn("font-semibold tracking-tight", textSizeClasses[textSize])}>
            Mermaid Flow Studio
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative flex-shrink-0">
        <Image
          src="/logo.svg"
          alt="Mermaid Flow Studio"
          width={size}
          height={size}
          className="rounded-2xl shadow-[0_20px_48px_-28px_rgba(15,23,42,0.7)]"
        />
      </div>
      {showText && (
        <div>
          <p className={cn("font-semibold tracking-tight", textSizeClasses[textSize])}>Mermaid Flow Studio</p>
          <p className={cn("text-[var(--muted-foreground)]", subtitleSizeClasses[textSize])}>
            Cleaner Mermaid diagrams, faster
          </p>
        </div>
      )}
    </div>
  )
}