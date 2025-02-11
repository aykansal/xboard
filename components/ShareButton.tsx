"use client";

import { Button } from "@/components/ui/button";
import { activityProps } from "@/lib/types";
import { Share2 } from "lucide-react";
import html2canvas from 'html2canvas';

export default function ShareButton({ activityData, username }: activityProps) {
  const shareOnTwitter = async () => {
    try {
      const heatmapElement = document.querySelector('.activity-heatmap')
      if (!heatmapElement) {
        throw new Error('Heatmap element not found')
      }
      // @ts-expect-error ignore
      const canvas = await html2canvas(heatmapElement, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        logging: false
      })

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!)
        }, 'image/png')
      })

      // Create form data for image upload
      const formData = new FormData()
      formData.append('image', blob, 'activity-heatmap.png')

      // Upload image to your image hosting service
      // Replace with your image upload API endpoint
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      const { imageUrl } = await response.json()

      // Share on Twitter
      const totalTweets = activityData.length;
      const tweetText = `📊 My Twitter activity heatmap shows ${totalTweets} tweets! Generated using XBoard`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}&url=${encodeURIComponent(imageUrl)}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Button 
      onClick={shareOnTwitter}
      className="pixel-button hover-pixel"
    >
      <Share2 className="mr-2 h-4 w-4" /> Share on X
    </Button>
  );
}
