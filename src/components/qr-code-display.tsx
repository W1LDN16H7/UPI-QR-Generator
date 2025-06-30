"use client"

import { QRCodeCanvas } from "qrcode.react"

interface QRTheme {
  id: string
  name: string
  colors: {
    foreground: string
    background: string
  }
}

interface QRCodeDisplayProps {
  value: string
  theme?: QRTheme
  size?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  includeMargin?: boolean
  imageSettings?: {
    src: string
    height: number
    width: number
    excavate: boolean
  }
}

export function QRCodeDisplay({
  value,
  theme,
  size = 200,
  errorCorrectionLevel = "M",
  includeMargin = true,
  imageSettings,
}: QRCodeDisplayProps) {
  return (
    <div className="relative">
      {/* Enhanced container with better styling */}
      <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-50">
        <QRCodeCanvas
          value={value}
          size={size}
          bgColor={theme?.colors.background || "#FFFFFF"}
          fgColor={theme?.colors.foreground || "#000000"}
          level={errorCorrectionLevel}
          includeMargin={includeMargin}
          imageSettings={imageSettings}
          style={{
            height: "auto",
            maxWidth: "100%",
            width: "100%",
          }}
        />
      </div>

      {/* Optional corner decoration */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full opacity-20"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full opacity-20"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full opacity-20"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full opacity-20"></div>
    </div>
  )
}
