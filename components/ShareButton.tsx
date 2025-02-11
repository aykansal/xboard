"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface ShareButtonProps {
  username: string
  activityData: number[]
}

export default function ShareButton({ username, activityData }: ShareButtonProps) {
  const shareOnTwitter = () => {
    const totalTweets = activityData.reduce((sum, count) => sum + count, 0)
    const tweetText = `I've tweeted ${totalTweets} times in the last 30 days! Check out my Twitter activity: `
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`
    window.open(url, "_blank")
  }

  return (
    <Button onClick={shareOnTwitter}>
      <Share2 className="mr-2 h-4 w-4" /> Share on X
    </Button>
  )
}

