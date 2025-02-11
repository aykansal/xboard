"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { activityProps } from "@/lib/types";
import html2canvas from "html2canvas";

export default function BannerGenerator({
  username,
  activityData,
}: activityProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBanner = async () => {
    setIsGenerating(true);
    try {
      // Find the heatmap element
      const heatmapElement = document.querySelector(".activity-heatmap");
      if (!heatmapElement) {
        throw new Error("Heatmap element not found");
      }

      // Configure html2canvas options for pixel-perfect rendering
      // @ts-expect-error ignore
      const canvas = await html2canvas(heatmapElement, {
        backgroundColor: "#0a0a0f", // Match your dark background
        scale: 2, // Higher resolution
        logging: false,
        width: heatmapElement.scrollWidth,
        height: heatmapElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Add any specific styles to the cloned element for better image generation
          const clonedHeatmap = clonedDoc.querySelector(".activity-heatmap");
          if (clonedHeatmap) {
            // @ts-expect-error ignore
            clonedHeatmap.style.padding = "24px";
            // @ts-expect-error ignore
            clonedHeatmap.style.borderRadius = "8px";
            // @ts-expect-error ignore
            clonedHeatmap.style.backgroundColor = "#0a0a0f";
          }
        },
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, "image/png");
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}-activity-heatmap.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating banner:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generateBanner}
      disabled={isGenerating}
      className="pixel-button hover-pixel"
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating..." : "Export Heatmap"}
    </Button>
  );
}
