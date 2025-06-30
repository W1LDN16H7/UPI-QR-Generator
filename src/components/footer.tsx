"use client"

import { Heart, ExternalLink, Github, Globe, Mail } from "lucide-react"
import { Button } from "./ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-12">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
            <span>by</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => handleLinkClick("https://github.com/yourusername")}
              className="p-0 h-auto font-medium text-primary hover:text-primary/80"
            >
              Your Name
            </Button>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLinkClick("https://your-portfolio.com")}
              className="h-8 px-3 text-xs"
            >
              <Globe className="h-3 w-3 mr-1.5" />
              Portfolio
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLinkClick("https://github.com/yourusername")}
              className="h-8 px-3 text-xs"
            >
              <Github className="h-3 w-3 mr-1.5" />
              GitHub
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLinkClick("https://github.com/yourusername/more-projects")}
              className="h-8 px-3 text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1.5" />
              More Projects
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLinkClick("mailto:your.email@example.com")}
              className="h-8 px-3 text-xs"
            >
              <Mail className="h-3 w-3 mr-1.5" />
              Contact
            </Button>
          </div>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground">© {currentYear} UPI QR Generator. All rights reserved.</div>

          {/* Tech stack badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Built with</span>
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-medium">
                React
              </span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md font-medium">
                Tailwind
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 rounded-md font-medium">
                shadcn/ui
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
