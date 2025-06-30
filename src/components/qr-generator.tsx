"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { QRCodeDisplay } from "./qr-code-display"
import { UPIIcon } from "./upi-icon"
import { Download, Share2, Copy, Smartphone, IndianRupee, User, AtSign, Plus, CheckCircle2, Palette, Zap, ExternalLink, ImageIcon, X, QrCode } from 'lucide-react'
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"

import upiIcon from "../assets/upi-id.svg"

interface UPIData {
  upiId: string
  name: string
  amount: string
}

interface QRTheme {
  id: string
  name: string
  colors: {
    foreground: string
    background: string
  }
}

const qrThemes: QRTheme[] = [
  {
    id: "classic",
    name: "Classic",
    colors: { foreground: "#000000", background: "#FFFFFF" },
  },
  {
    id: "minimal",
    name: "Minimal",
    colors: { foreground: "#374151", background: "#f9fafb" },
  },
  {
    id: "inverse",
    name: "Dark",
    colors: { foreground: "#ffffff", background: "#000000" },
  },
  {
    id: "blue",
    name: "Blue",
    colors: { foreground: "#1e40af", background: "#eff6ff" },
  },
  {
    id: "green",
    name: "Green",
    colors: { foreground: "#166534", background: "#f0fdf4" },
  },
  {
    id: "purple",
    name: "Purple",
    colors: { foreground: "#7c3aed", background: "#f3f4f6" },
  },
  {
    id: "red",
    name: "Red",
    colors: { foreground: "#dc2626", background: "#fef2f2" },
  },
  {
    id: "orange",
    name: "Orange",
    colors: { foreground: "#ea580c", background: "#fff7ed" },
  },
]

const colorPalette = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#6B7280" },
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Orange", value: "#F97316" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Lime", value: "#84CC16" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Violet", value: "#8B5CF6" },
]

// Default UPI logos
const defaultLogos = [
  {
    id: "upi-default",
    name: "UPI Default",
    url: upiIcon
  },
  {
    id: "bhim",
    name: "BHIM",
    url: "https://cdn.iconscout.com/icon/free/png-512/bhim-3-69845.png",
  },

]

export function QRGenerator() {
  const [upiData, setUpiData] = useState<UPIData>({
    upiId: "",
    name: "",
    amount: "",
  })
  const [selectedTheme, setSelectedTheme] = useState<QRTheme>(qrThemes[0])
  const [customColors, setCustomColors] = useState({
    foreground: "#000000",
    background: "#FFFFFF",
  })
  const [qrValue, setQrValue] = useState("")
  const [isGenerated, setIsGenerated] = useState(false)

  // Logo settings
  const [logoEnabled, setLogoEnabled] = useState(true)
  const [logoType, setLogoType] = useState<"default" | "custom">("default")
  const [selectedDefaultLogo, setSelectedDefaultLogo] = useState(defaultLogos[0].id)
  const [customLogoUrl, setCustomLogoUrl] = useState("")
  const [logoSize, setLogoSize] = useState(40)

  useEffect(() => {
    if (upiData.upiId && upiData.name) {
      const upiString = `upi://pay?pa=${upiData.upiId}&pn=${encodeURIComponent(upiData.name)}&am=${upiData.amount}`
      setQrValue(upiString)
      setIsGenerated(true)
    } else {
      setQrValue("")
      setIsGenerated(false)
    }
  }, [upiData])

  const handleInputChange = (field: keyof UPIData, value: string) => {
    setUpiData((prev) => ({ ...prev, [field]: value }))
  }

  const getLogoUrl = () => {
    if (!logoEnabled) return ""

    if (logoType === "custom") {
      return customLogoUrl
    } else {
      const selectedLogo = defaultLogos.find((logo) => logo.id === selectedDefaultLogo)
      return selectedLogo?.url || ""
    }
  }

  const downloadQR = async () => {
    if (!qrValue) {
      toast.error("Please create a QR code first!")
      return
    }

    try {
      const QRCode = (await import("qrcode")).default
      const canvas = document.createElement("canvas")

      await QRCode.toCanvas(canvas, qrValue, {
        width: 400,
        margin: 4,
        color: {
          dark: customColors.foreground,
          light: customColors.background,
        },
        errorCorrectionLevel: "M",
      })

      const link = document.createElement("a")
      link.download = `${upiData.name.replace(/\s+/g, "-")}-qr-code.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("QR code downloaded!")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Download failed")
    }
  }

  const shareQR = async () => {
    if (!qrValue) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Pay ${upiData.name}`,
          text: `UPI Payment${upiData.amount ? ` - ₹${upiData.amount}` : ""}`,
          url: qrValue,
        })
      } else {
        await navigator.clipboard.writeText(qrValue)
        toast.success("Payment link copied!")
      }
    } catch (error) {
      await navigator.clipboard.writeText(qrValue)
      toast.success("Payment link copied!")
    }
  }

  const copyLink = async () => {
    if (!qrValue) return
    try {
      await navigator.clipboard.writeText(qrValue)
      toast.success("Link copied!")
    } catch (error) {
      toast.error("Copy failed")
    }
  }

  const openInUPI = () => {
    if (!qrValue) return
    window.open(qrValue, "_blank")
    toast.success("Opening payment app...")
  }

  const generateShareableLink = () => {
    if (!qrValue) return

    const shareableData = {
      upiId: upiData.upiId,
      name: upiData.name,
      amount: upiData.amount,
      theme: selectedTheme.id,
      colors: customColors,
    }

    const encodedData = btoa(JSON.stringify(shareableData))
    const shareableUrl = `${window.location.origin}?qr=${encodedData}`

    navigator.clipboard.writeText(shareableUrl)
    toast.success("Shareable link copied! Anyone can view this QR code.")
  }

  const addToGallery = () => {
    if (!qrValue || !upiData.name) {
      toast.error("Please fill UPI ID and Name first")
      return
    }

    const galleryData = {
      id: Date.now().toString(),
      upiData,
      theme: {
        ...selectedTheme,
        colors: customColors,
      },
      qrValue,
      timestamp: new Date().toISOString(),
    }

    const existingGallery = JSON.parse(localStorage.getItem("qrGallery") || "[]")
    existingGallery.unshift(galleryData)
    localStorage.setItem("qrGallery", JSON.stringify(existingGallery.slice(0, 50)))

    toast.success("Added to gallery!")
  }

  const applyTheme = (theme: QRTheme) => {
    setSelectedTheme(theme)
    setCustomColors(theme.colors)
  }

  const logoUrl = getLogoUrl()
  const imageSettings =
    logoEnabled && logoUrl
      ? {
          src: logoUrl,
          height: logoSize,
          width: logoSize,
          excavate: true,
        }
      : undefined

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={upiIcon} alt="UPI ID" className="h-16 w-16" />
          <h1 className="text-2xl font-bold">UPI QR Generator</h1>
        </div>
        <p className="text-sm text-muted-foreground">Create a customizable UPI QR code in seconds</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Form & Logo Options */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <User className="h-4 w-4 text-primary" />
          </div>
          Payment Details
              </CardTitle>
              <CardDescription className="text-sm">Enter payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
          <Label htmlFor="upiId" className="flex items-center gap-1.5 text-xs font-medium">
            <AtSign className="h-3 w-3 text-muted-foreground" />
            UPI ID *
          </Label>
          <Input
            id="upiId"
            placeholder="example@upi"
            value={upiData.upiId}
            onChange={(e) => handleInputChange("upiId", e.target.value)}
            className="h-8 text-sm"
          />
              </div>

              <div className="space-y-1.5">
          <Label htmlFor="name" className="flex items-center gap-1.5 text-xs font-medium">
            <User className="h-3 w-3 text-muted-foreground" />
            Name *
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={upiData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="h-8 text-sm"
          />
              </div>

              <div className="space-y-1.5">
          <Label htmlFor="amount" className="flex items-center gap-1.5 text-xs font-medium">
            <IndianRupee className="h-3 w-3 text-muted-foreground" />
            Amount (Optional)
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="100"
            value={upiData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            className="h-8 text-sm"
          />
              </div>
            </CardContent>
          </Card>

          {/* Logo Options - Inline without card */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <Label className="text-sm font-medium">Logo Options</Label>
            </div>

            {/* Logo Enable/Disable and Type in one row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-muted rounded-lg p-3">
          <Label className="text-xs font-medium">Show Logo</Label>
          <Switch checked={logoEnabled} onCheckedChange={setLogoEnabled} />
              </div>

              {logoEnabled && (
          <Select value={logoType} onValueChange={(value: "default" | "custom") => setLogoType(value)}>
            <SelectTrigger className="h-12 text-sm bg-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Icons</SelectItem>
              <SelectItem value="custom">Custom URL</SelectItem>
            </SelectContent>
          </Select>
              )}
            </div>

            {/* Logo Selection Row */}
            {logoEnabled && (
              <div className="grid grid-cols-2 gap-3">
          {logoType === "default" ? (
            <Select value={selectedDefaultLogo} onValueChange={setSelectedDefaultLogo}>
              <SelectTrigger className="h-12 text-sm bg-muted">
                <SelectValue>
            <div className="flex items-center gap-2">
              <img
                src={defaultLogos.find((l) => l.id === selectedDefaultLogo)?.url || "/placeholder.svg"}
                alt="Logo"
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
              <span>{defaultLogos.find((l) => l.id === selectedDefaultLogo)?.name}</span>
            </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {defaultLogos.map((logo) => (
            <SelectItem key={logo.id} value={logo.id}>
              <div className="flex items-center gap-2">
                <img
                  src={logo.url || "/placeholder.svg"}
                  alt={logo.name}
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
              e.currentTarget.style.display = "none"
                  }}
                />
                <span>{logo.name}</span>
              </div>
            </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="relative">
              <Input
                placeholder="https://example.com/logo.png"
                value={customLogoUrl}
                onChange={(e) => setCustomLogoUrl(e.target.value)}
                className="h-12 text-sm pr-8 bg-muted"
              />
              {customLogoUrl && (
                <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCustomLogoUrl("")}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                >
            <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {/* Logo Size */}
          <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
            <Label className="text-xs font-medium">Size:</Label>
            <Input
              type="number"
              min="20"
              max="80"
              value={logoSize}
              onChange={(e) => setLogoSize(Number(e.target.value))}
              className="h-6 text-xs flex-1 min-w-0 bg-background"
            />
            <span className="text-xs text-muted-foreground">px</span>
          </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Column - Style Customization */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-md">
                  <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                Style & Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Themes */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <Label className="text-xs font-medium">Quick Themes</Label>
                </div>
                <Select
                  value={selectedTheme.id}
                  onValueChange={(value) => {
                    const theme = qrThemes.find((t) => t.id === value)
                    if (theme) applyTheme(theme)
                  }}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded border"
                          style={{ backgroundColor: selectedTheme.colors.foreground }}
                        />
                        <span>{selectedTheme.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {qrThemes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded border"
                            style={{ backgroundColor: theme.colors.foreground }}
                          />
                          <span>{theme.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Color Customization */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Foreground Color</Label>
                  <div className="flex gap-1 flex-wrap">
                    {colorPalette.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setCustomColors((prev) => ({ ...prev, foreground: color.value }))}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 color-picker-btn ${
                          customColors.foreground === color.value ? "selected" : ""
                        }`}
                        aria-label={color.name}
                      >
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: color.value }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Background Color</Label>
                  <div className="flex gap-1 flex-wrap">
                    {colorPalette.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setCustomColors((prev) => ({ ...prev, background: color.value }))}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 color-picker-btn ${
                          customColors.background === color.value ? "selected" : ""
                        }`}
                        aria-label={color.name}
                      >
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: color.value }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - QR Display */}
        <div>
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-md">
                  <QrCode className="text-green-600 dark:text-green-400" size={16} />
                </div>
                Your QR Code
              </CardTitle>
              <CardDescription className="text-sm">
                {isGenerated ? "Ready to use" : "Fill the form to generate"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerated ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <QRCodeDisplay
                      value={qrValue}
                      theme={{
                        ...selectedTheme,
                        colors: customColors,
                      }}
                      size={200}
                      errorCorrectionLevel="M"
                      includeMargin={true}
                      imageSettings={imageSettings}
                    />
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">QR Code Ready</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {upiData.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {upiData.amount ? `₹${upiData.amount}` : "Any Amount"}
                      </Badge>
                      {logoEnabled && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          With Logo
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={downloadQR} size="sm" className="h-8 text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button onClick={shareQR} variant="outline" size="sm" className="h-8 text-xs">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button onClick={copyLink} variant="outline" size="sm" className="h-8 text-xs">
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button onClick={openInUPI} variant="outline" size="sm" className="h-8 text-xs">
                      <Smartphone className="h-3 w-3 mr-1" />
                      Pay
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={addToGallery} size="sm" className="h-8 text-xs" variant="secondary">
                      <Plus className="h-3 w-3 mr-1" />
                      Save to Gallery
                    </Button>
                    <Button onClick={generateShareableLink} variant="outline" size="sm" className="h-8 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Share Link
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-3 bg-muted rounded-2xl flex items-center justify-center">
                    <QrCode className="text-muted-foreground" size={32} />
                  </div>
                  <h3 className="text-base font-medium mb-1">Ready to Generate</h3>
                  <p className="text-sm text-muted-foreground">Fill in UPI ID and Name</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
