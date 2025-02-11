"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Image } from "lucide-react"

interface BannerGeneratorProps {
  username: string
  activityData: number[]
}

export default function BannerGenerator({ username, activityData }: BannerGeneratorProps) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)

  const generateBanner = async () => {
    try {
      const response = await fetch("/api/generate-banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, activityData }),
      })
      const data = await response.json()
      setBannerUrl(data.bannerUrl)
    } catch (error) {
      console.error("Error generating banner:", error)
    }
  }

  return (
    <div>
      <Button onClick={generateBanner}>
        <Image className="mr-2 h-4 w-4" /> Generate Banner
      </Button>
      {bannerUrl && (
        <div className="mt-4">
          <img src={bannerUrl || "/placeholder.svg"} alt="Generated Twitter Banner" className="w-full" />
          <a href={bannerUrl} download className="mt-2 inline-block text-blue-500 hover:underline">
            Download Banner
          </a>
        </div>
      )}
    </div>
  )
}

