"use client"

import { useState, useEffect } from "react"
import { QRGenerator } from "./components/qr-generator"
import { QRGallery } from "./components/qr-gallery"
import { QRViewer } from "./components/qr-viewer"
import { FloatingNav } from "./components/floating-nav"
import { Header } from "./components/header"

import { ThemeProvider } from "./components/theme-provider"

export default function App() {
  const [activeTab, setActiveTab] = useState("generator")
  const [isViewingSharedQR, setIsViewingSharedQR] = useState(false)

  useEffect(() => {
    // Check if URL has QR parameter for shared QR viewing
    const urlParams = new URLSearchParams(window.location.search)
    const hasQRParam = urlParams.has("qr")
    setIsViewingSharedQR(hasQRParam)
  }, [])

  const handleBackFromViewer = () => {
    setIsViewingSharedQR(false)
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 relative">
        {!isViewingSharedQR && <Header />}

        <div className="relative z-10">
          {isViewingSharedQR ? (
            <QRViewer onBack={handleBackFromViewer} />
          ) : activeTab === "generator" ? (
            <QRGenerator />
          ) : (
            <QRGallery />
          )}
        </div>

        {!isViewingSharedQR && <FloatingNav activeTab={activeTab} onTabChange={setActiveTab} />}
        
      </div>
    </ThemeProvider>
  )
}
