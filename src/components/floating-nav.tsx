"use client"

import { Grid3X3, Sun, Moon, Monitor, Contact, QrCode } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { UPIIcon } from "./upi-icon"

interface FloatingNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const handlePortfolioClick = () => {
    window.location.href = "https://portfolio-chi-pied-26.vercel.app/"
  }

export function FloatingNav({ activeTab, onTabChange }: FloatingNavProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-full p-1.5 flex items-center gap-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
        <Button
          onClick={() => onTabChange("generator")}
          variant={activeTab === "generator" ? "default" : "ghost"}
          size="sm"
          className="rounded-full h-10 w-10 transition-all duration-200"
        >
          <UPIIcon size={16} />
        </Button>

        <Button
          onClick={() => onTabChange("gallery")}
          variant={activeTab === "gallery" ? "default" : "ghost"}
          size="sm"
          className="rounded-full h-10 w-10 transition-all duration-200"
        >
          <QrCode className="h-4 w-4" />
        </Button>
        <Button
          // onClick={() => handlePortfolioClick()}
          variant="ghost"
          size="sm"
          title="Made with ❤️ by Kapil Kumar"

          className="rounded-full h-10 w-10 transition-all duration-200"
        >
          <Contact className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 transition-all duration-200">
              {theme === "light" ? (
                <Sun className="h-4 w-4" />
              ) : theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
              <Monitor className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
