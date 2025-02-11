import { NextRequest, NextResponse } from "next/server";
// import instructions from './instructions.json';
import axios from 'axios';
import { headers } from "next/headers";
import { ratelimit } from "@/lib/ratelimit";

// Add these export configurations
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(req: NextRequest) {
    try {
        // Get IP from various possible headers
        const headersList = headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        const realIp = headersList.get("x-real-ip");
        const ip = forwardedFor?.split(',')[0] || realIp || "127.0.0.1";
        
        const identifier = `xboard_${ip}`; // Add prefix to make the identifier unique
        
        const { success, reset, remaining, limit } = await ratelimit.limit(identifier);
        
        if (!success) {
            const now = Date.now();
            const resetIn = Math.max(8000, reset - now); // Ensure minimum 20s cooldown
            
            return new NextResponse(
                JSON.stringify({
                    error: "Rate limit exceeded. Please try again later.",
                    resetIn,
                }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Reset": resetIn.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Limit": limit.toString(),
                    },
                }
            );
        }

        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');
        const tweetResponse = await axios.get("https://twitter-x.p.rapidapi.com/user/tweetsandreplies", {
            params: {
                username,
                limit
            },
            headers: {
                'x-rapidapi-key': process.env.RAPID_API_KEY,
                'x-rapidapi-host': 'twitter-x.p.rapidapi.com'
            }
        });
        const instructions = await tweetResponse?.data?.data?.user_result?.result?.timeline_response?.timeline?.instructions || [];
        const tweetEntries = instructions.find((inst: any) => inst.__typename === "TimelineAddEntries")?.entries || [];
        const ownerTweets: any = [];
        
        // Process each entry in the tweetEntries array
        tweetEntries.forEach((entry: any) => {
            if (entry.content?.__typename === "TimelineTimelineModule") {
                const items = entry.content.items || [];
                items.forEach((item: any) => {
                    const tweetContent = item.item?.content;
                    if (tweetContent?.__typename === "TimelineTweet") {
                        const tweetResult = tweetContent.tweetResult?.result;
                        if (tweetResult?.__typename === "Tweet") {
                            const legacy = tweetResult.legacy || {};
                            const fullText = legacy.full_text || "";
                            const createdAt = legacy.created_at || "";
                            const tweetId = tweetResult.rest_id || "";
                            const authorUsername = tweetResult.core?.user_result?.result?.legacy?.screen_name || "";
                            
                            // Check if the tweet is authored by the owner
                            if (authorUsername === username) {
                                ownerTweets.push({
                                    tweetId: tweetId,
                                    tweet: fullText,
                                    created_at: createdAt
                                });
                            }
                        }
                    }
                });
            }
        });
        
        return NextResponse.json(ownerTweets);
    } catch (error) {
        console.error("Error fetching tweets:", error);
        return NextResponse.json({ message: 'Error fetching user tweets', status: 500 }, { status: 500 });
    }
}