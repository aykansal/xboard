"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ActivityGraphProps {
  data: number[];
  totalTweets?: number;
}

export default function ActivityGraph({
  data,
  totalTweets,
}: ActivityGraphProps) {
  const [calendar, setCalendar] = useState<{ date: Date; count: number }[][]>(
    []
  );
  const [maxCount, setMaxCount] = useState(0);
  const [currentHover, setCurrentHover] = useState<{
    date: Date;
    count: number;
  } | null>(null);

  useEffect(() => {
    // Create calendar data structure
    const today = new Date();
    const calendar: { date: Date; count: number }[][] = [];
    let maxValue = 0;

    // Initialize 53 columns (weeks)
    for (let week = 0; week < 53; week++) {
      calendar[week] = [];
    }

    // Fill in the last 53 weeks
    for (let week = 52; week >= 0; week--) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - ((52 - week) * 7 + (6 - day)));

        const dayIndex = week;
        const count = data[dayIndex * 7 + day] || 0;
        calendar[week][day] = { date, count };

        // Update max count for color intensity calculation
        maxValue = Math.max(maxValue, count);
      }
    }

    setMaxCount(maxValue);
    setCalendar(calendar);
  }, [data]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-[#161b22] hover:bg-[#161b22]/80";
    const intensity = Math.ceil((count / maxCount) * 4);
    switch (intensity) {
      case 1:
        return "bg-[#0e4429] hover:bg-[#0e4429]/80";
      case 2:
        return "bg-[#006d32] hover:bg-[#006d32]/80";
      case 3:
        return "bg-[#26a641] hover:bg-[#26a641]/80";
      case 4:
        return "bg-[#39d353] hover:bg-[#39d353]/80";
      default:
        return "bg-[#161b22] hover:bg-[#161b22]/80";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <Card className="border-[#30363d] bg-[#0d1117] bg-opacity-95 backdrop-blur-sm text-white">
      <CardHeader className="border-[#30363d] border-b">
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CardTitle className="font-medium text-lg">
            {totalTweets || data.reduce((sum, count) => sum + count, 0)} tweets
            in the last year
          </CardTitle>
          {currentHover && (
            <span className="text-muted-foreground text-sm">
              {currentHover.count} tweets on {formatDate(currentHover.date)}
            </span>
          )}
        </motion.div>
      </CardHeader>
      <CardContent className="pt-6">
        <motion.div 
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex gap-4">
            {/* Week days labels */}
            <div className="flex flex-col justify-between py-[10px] text-muted-foreground text-xs">
              {weekDays.map((day) => (
                <div key={day} className="h-[10px] leading-[10px]">
                  {day}
                </div>
              ))}
            </div>

            <div className="flex-1">
              {/* Months labels */}
              <div className="flex mb-2 text-muted-foreground text-xs">
                {calendar.map(([firstDay], weekIndex) => {
                  const date = firstDay.date;
                  const showMonth = date.getDate() <= 7;
                  return showMonth ? (
                    <div
                      key={weekIndex}
                      className="flex-1 text-center"
                      style={{ marginLeft: weekIndex === 0 ? 0 : "-8px" }}
                    >
                      {months[date.getMonth()]}
                    </div>
                  ) : null;
                })}
              </div>

              {/* Activity grid */}
              <div className="gap-[3px] grid grid-cols-53">
                {Array.from({ length: 7 }, (_, dayIndex) => (
                  <div key={dayIndex} className="contents">
                    {calendar.map((week, weekIndex) => {
                      const { date, count } = week[dayIndex] || {
                        date: new Date(),
                        count: 0,
                      };
                      return (
                        <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.2,
                                  delay: (weekIndex * 7 + dayIndex) * 0.001,
                                }}
                              >
                                <div
                                  className={cn(
                                    "w-[10px] h-[10px] rounded-sm transition-all duration-200",
                                    getIntensityClass(count),
                                    "hover:scale-125"
                                  )}
                                  role="gridcell"
                                  aria-label={`${count} tweets on ${formatDate(date)}`}
                                  onMouseEnter={() => setCurrentHover({ date, count })}
                                  onMouseLeave={() => setCurrentHover(null)}
                                />
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent 
                              className="border-[#30363d] bg-[#161b22] text-white"
                              side="top"
                            >
                              <p className="text-sm">
                                <span className="font-medium">{count} tweets</span> on{" "}
                                {formatDate(date)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-end items-center gap-2 border-[#30363d] pt-4 border-t text-muted-foreground text-xs">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  "w-[10px] h-[10px] rounded-sm",
                  getIntensityClass(level * Math.ceil(maxCount / 4))
                )}
              />
            ))}
            <span>More</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
