"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActivityGraph from "@/components/ActivityGraph";
import ShareButton from "@/components/ShareButton";
import BannerGenerator from "@/components/BannerGenerator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import LoadingAnimation from "@/components/LoadingAnimation";
import { Tweet } from "@/lib/types";

export default function ActivityDashboard() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number | null>(null);
  const [activityData, setActivityData] = useState<Tweet[]>([]);
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);
  const COOLDOWN_PERIOD = 20000; // 20 seconds in milliseconds

  const fetchActivityData = async () => {
    const now = Date.now();
    
    // Check if we're still in cooldown
    if (lastRequestTime && now - lastRequestTime < COOLDOWN_PERIOD) {
      const remainingCooldown = COOLDOWN_PERIOD - (now - lastRequestTime);
      setCooldown(remainingCooldown);
      setError(`Please wait ${Math.ceil(remainingCooldown / 1000)} seconds before trying again.`);
      return;
    }

    if (!username.trim() || cooldown) return;

    setIsLoading(true);
    setError(null);
    
    try {
      setLastRequestTime(now);
      const response = await fetch(`/api/tweets?username=${username}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const resetIn = parseInt(response.headers.get("X-RateLimit-Reset") || "20000");
          setCooldown(Math.max(20000, resetIn)); // Ensure minimum 20s cooldown
          throw new Error(`Please wait ${Math.ceil(resetIn / 1000)} seconds before trying again.`);
        }
        throw new Error(data.error || "Failed to fetch activity data");
      }

      setActivityData(data);
    } catch (error) {
      console.error("Error fetching activity data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch activity data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Improved cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (cooldown && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (!prev || prev <= 1000) {
            setLastRequestTime(null); // Reset last request time when cooldown ends
            return null;
          }
          return prev - 1000;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [cooldown]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchActivityData();
    }
  };

  return (
    <div className="space-y-8 mx-auto max-w-5xl">
      <motion.div
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="font-['Press_Start_2P'] text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#4a9eff] via-[#6b4aff] to-[#ff4a9e]">
          XBoard
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground/80">
          Visualize your Twitter activity over the past year with a GitHub-style
          contribution graph. Track your posting patterns and generate custom
          banners.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Track Activity</CardTitle>
            <CardDescription>
              Enter a Twitter username to view their activity heatmap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex sm:flex-row flex-col gap-4">
              <div className="relative flex-1 group">
                <Input
                  type="text"
                  placeholder="Enter Twitter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pixel-input"
                />
              </div>
              <Button
                onClick={fetchActivityData}
                disabled={isLoading || !username.trim() || !!cooldown}
                className="pixel-button"
              >
                {isLoading ? (
                  <LoadingAnimation />
                ) : cooldown ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Wait {Math.max(1, Math.ceil(cooldown / 1000))}s
                  </>
                ) : (
                  <>
                    <span className="mr-2">{">"}</span>
                    Track Activity
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {activityData && activityData?.length > 0 && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ActivityGraph activityData={activityData} />

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Share & Export</CardTitle>
                <CardDescription>
                  Share your activity or generate a custom banner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex sm:flex-row flex-col sm:justify-between gap-4">
                  <ShareButton activityData={activityData} />
                  <BannerGenerator
                    username={username}
                    activityData={activityData}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
