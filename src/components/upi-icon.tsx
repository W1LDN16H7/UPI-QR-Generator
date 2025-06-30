"use client"

interface UPIIconProps {
  className?: string
  size?: number
}

export function UPIIcon({ className = "", size = 24 }: UPIIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity="0.1" />
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 12h10M7 8h6M7 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="8" r="1" fill="currentColor" />
    </svg>
  )
}
