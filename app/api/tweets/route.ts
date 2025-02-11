
import { NextRequest, NextResponse } from "next/server";
// import instructions from './instructions.json';
import axios from 'axios';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');
        const limit = searchParams.get('limit');
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

        return NextResponse.json(ownerTweets.length);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching user tweets', status: 500 });
    }
}