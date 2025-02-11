"use client";

import { Button } from "@/components/ui/button";
import { activityProps } from "@/lib/types";
import { Share2 } from "lucide-react";

export default function ShareButton({ activityData }: activityProps) {
  const shareOnTwitter = () => {
    const totalTweets = activityData.length;
    const tweetText = `I've tweeted ${totalTweets} times in the last 30 days! Check out my Twitter activity: `;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  return (
    <Button onClick={shareOnTwitter}>
      <Share2 className="mr-2 h-4 w-4" /> Share on X
    </Button>
  );
}
