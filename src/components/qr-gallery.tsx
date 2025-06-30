"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { QRCodeDisplay } from "./qr-code-display"
import { Download, Copy, Trash2, Calendar, Grid3X3, Search, Filter, Sparkles, QrCode, QrCodeIcon } from "lucide-react"
import { toast } from "sonner"

interface GalleryQR {
  id: string
  upiData: {
    upiId: string
    name: string
    amount: string
  }
  theme?: {
    id: string
    name: string
    style: string
    dotStyle?: string
    colors: {
      foreground: string
      background: string
    }
  }
  qrValue: string
  timestamp: string
}

export function QRGallery() {
  const [galleryQRs, setGalleryQRs] = useState<GalleryQR[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTheme, setFilterTheme] = useState("all")

  useEffect(() => {
    const loadGalleryData = () => {
      const data = JSON.parse(localStorage.getItem("qrGallery") || "[]")
      setGalleryQRs(data)
    }

    loadGalleryData()
    const handleStorageChange = () => loadGalleryData()
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const removeFromGallery = (id: string) => {
    const updatedGallery = galleryQRs.filter((qr) => qr.id !== id)
    setGalleryQRs(updatedGallery)
    localStorage.setItem("qrGallery", JSON.stringify(updatedGallery))
    toast.success("Removed from gallery")
  }

  const downloadQR = async (qr: GalleryQR) => {
    try {
      const QRCode = (await import("qrcode")).default
      const canvas = document.createElement("canvas")

      await QRCode.toCanvas(canvas, qr.qrValue, {
        width: 512,
        margin: 4,
        color: {
          dark: qr.theme?.colors.foreground || "#000000",
          light: qr.theme?.colors.background || "#FFFFFF",
        },
      })

      const link = document.createElement("a")
      link.download = `${qr.upiData.name.replace(/\s+/g, "-")}-upi-qr.png`
      link.href = canvas.toDataURL()
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Downloaded!")
    } catch (error) {
      toast.error("Download failed")
    }
  }

  const copyLink = async (qrValue: string) => {
    try {
      await navigator.clipboard.writeText(qrValue)
      toast.success("UPI link copied!")
    } catch (error) {
      toast.error("Copy failed")
    }
  }

  const clearGallery = () => {
    setGalleryQRs([])
    localStorage.removeItem("qrGallery")
    toast.success("Gallery cleared!")
  }

  const filteredQRs = galleryQRs.filter((qr) => {
    const matchesSearch =
      qr.upiData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qr.upiData.upiId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTheme = filterTheme === "all" || qr.theme?.id === filterTheme
    return matchesSearch && matchesTheme
  })

  const uniqueThemes = Array.from(new Set(galleryQRs.map((qr) => qr.theme?.id).filter(Boolean)))

  if (galleryQRs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pb-24 max-w-6xl">
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
            <QrCode className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-balance">Your Gallery is Empty</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
            Create some beautiful QR codes and add them to your gallery to see them here.
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Start creating your first QR code!</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <QrCodeIcon className="h-10 w-10 text-primary" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent text-balance">
              QR Gallery
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Manage and organize your generated QR codes</p>
        </div>
        {galleryQRs.length > 0 && (
          <Button onClick={clearGallery} variant="destructive" size="lg" className="h-12">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-8 border-2 hover:border-primary/20 transition-colors">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or UPI ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
            </div>
            <div className="sm:w-56">
              <Select value={filterTheme} onValueChange={setFilterTheme}>
                <SelectTrigger className="h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  {uniqueThemes.map((themeId) => (
                    <SelectItem key={themeId} value={themeId || ""}>
                      {(themeId ?? "").charAt(0).toUpperCase() + (themeId ?? "").slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{galleryQRs.length}</div>
            <p className="text-sm text-muted-foreground font-medium">Total QR Codes</p>
          </CardContent>
        </Card>
        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{uniqueThemes.length}</div>
            <p className="text-sm text-muted-foreground font-medium">Different Themes</p>
          </CardContent>
        </Card>
        <Card className="border-2 hover:border-primary/20 transition-colors">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{filteredQRs.length}</div>
            <p className="text-sm text-muted-foreground font-medium">Filtered Results</p>
          </CardContent>
        </Card>
      </div>

      {/* QR Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredQRs.map((qr) => (
          <Card
            key={qr.id}
            className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 card-hover"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{qr.upiData.name}</CardTitle>
                  <CardDescription className="text-sm truncate">{qr.upiData.upiId}</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  {qr.theme?.name || "Classic"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <QRCodeDisplay value={qr.qrValue} theme={qr.theme} size={180} />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Amount:</span>
                  <Badge variant="secondary" className="font-medium">
                    {qr.upiData.amount ? `₹${qr.upiData.amount}` : "Any Amount"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(qr.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => downloadQR(qr)} className="flex-1 h-10">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={() => copyLink(qr.qrValue)} className="flex-1 h-10">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeFromGallery(qr.id)}
                  className="text-destructive hover:text-destructive h-10 w-10 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQRs.length === 0 && galleryQRs.length > 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">No Results Found</h3>
          <p className="text-lg text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
