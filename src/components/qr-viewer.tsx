"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { QRCodeDisplay } from "./qr-code-display"
import { UPIIcon } from "./upi-icon"
import {
  Download,
  Share2,
  Copy,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Zap,
  Star,
  Users,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

interface SharedQRData {
  upiId: string
  name: string
  amount: string
  theme: string
  colors: {
    foreground: string
    background: string
  }
}

interface QRViewerProps {
  onBack: () => void
}

export function QRViewer({ onBack }: QRViewerProps) {
  const [qrData, setQrData] = useState<SharedQRData | null>(null)
  const [qrValue, setQrValue] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadSharedQR = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const encodedData = urlParams.get("qr")

        if (!encodedData) {
          setError("No QR data found in URL")
          setLoading(false)
          return
        }

        const decodedData = JSON.parse(atob(encodedData))
        setQrData(decodedData)

        // Generate UPI string
        const upiString = `upi://pay?pa=${decodedData.upiId}&pn=${encodeURIComponent(decodedData.name)}&am=${decodedData.amount}`
        setQrValue(upiString)
        setLoading(false)
      } catch (err) {
        console.error("Error loading shared QR:", err)
        setError("Invalid QR data")
        setLoading(false)
      }
    }

    loadSharedQR()
  }, [])

  const downloadQR = async () => {
    if (!qrValue || !qrData) return

    try {
      const QRCode = (await import("qrcode")).default
      const canvas = document.createElement("canvas")

      await QRCode.toCanvas(canvas, qrValue, {
        width: 512,
        margin: 4,
        color: {
          dark: qrData.colors.foreground,
          light: qrData.colors.background,
        },
        errorCorrectionLevel: "M",
      })

      const link = document.createElement("a")
      link.download = `${qrData.name.replace(/\s+/g, "-")}-qr-code.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("QR code downloaded successfully! 📥")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Download failed. Please try again.")
    }
  }

  const shareQR = async () => {
    if (!qrValue) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Pay ${qrData?.name}`,
          text: `UPI Payment${qrData?.amount ? ` - ₹${qrData.amount}` : ""} via UPI QR Generator`,
          url: window.location.href,
        })
        toast.success("Shared successfully! 🚀")
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Share link copied to clipboard! 📋")
      }
    } catch (error) {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Share link copied to clipboard! 📋")
    }
  }

  const copyLink = async () => {
    if (!qrValue) return
    try {
      await navigator.clipboard.writeText(qrValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("UPI link copied! 📋")
    } catch (error) {
      toast.error("Copy failed. Please try again.")
    }
  }

  const openInUPI = () => {
    if (!qrValue) return
    window.open(qrValue, "_blank")
    toast.success("Opening payment app... 📱")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-pulse">
                  <UPIIcon className="text-white" size={40} />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Loading QR Code
                </h2>
                <p className="text-muted-foreground">Preparing your payment QR code...</p>
              </div>
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !qrData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Oops! Invalid Link</h2>
                <p className="text-muted-foreground">
                  {error || "The QR code link appears to be invalid or corrupted"}
                </p>
              </div>
              <Button
                onClick={onBack}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Enhanced Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:bg-white dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Payment QR Code
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />
              Shared by {qrData.name}
            </p>
          </div>
        </div>

        {/* Enhanced QR Display */}
        <Card className="mb-8 border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-1"></div>
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <div className="p-3 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl">
                <UPIIcon className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Secure Payment
              </span>
            </CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              Scan with any UPI app to pay instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* QR Code with Enhanced Styling */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-white/20">
                    <QRCodeDisplay
                      value={qrValue}
                      theme={{
                        id: qrData.theme,
                        name: qrData.theme,
                        colors: qrData.colors,
                      }}
                      size={280}
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Status and Info */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Ready for Payment</span>
                  <Star className="h-4 w-4 fill-current" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      {qrData.name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="px-4 py-2 text-sm bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-200 dark:border-green-800"
                    >
                      💰 {qrData.amount ? `₹${qrData.amount}` : "Any Amount"}
                    </Badge>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="text-sm text-muted-foreground mb-1">UPI ID</div>
                    <code className="bg-background px-3 py-2 rounded-lg text-sm font-mono border">{qrData.upiId}</code>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={downloadQR}
                  className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={shareQR}
                  variant="outline"
                  className="h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={copyLink}
                  variant="outline"
                  className="h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Copy className={`h-4 w-4 mr-2 ${copied ? "text-green-500" : ""}`} />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  onClick={openInUPI}
                  className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Instructions */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-lg">Quick Payment Guide</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">Open UPI App</div>
                    <div className="text-xs text-muted-foreground mt-1">GPay, PhonePe, Paytm, etc.</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">Scan QR Code</div>
                    <div className="text-xs text-muted-foreground mt-1">Point camera at the code</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">Complete Payment</div>
                    <div className="text-xs text-muted-foreground mt-1">Enter PIN and confirm</div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
