import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user data")
    }

    const userData = await response.json()
    const userId = userData.data.id

    // Get tweets for the past year (max 100 tweets per request, we'll need pagination)
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - 1)
    const startTime = startDate.toISOString()

    let allTweets: any[] = []
    let paginationToken = null

    do {
      const tweetsUrl = new URL(`https://api.twitter.com/2/users/${userId}/tweets`)
      tweetsUrl.searchParams.append('max_results', '100')
      tweetsUrl.searchParams.append('tweet.fields', 'created_at')
      tweetsUrl.searchParams.append('start_time', startTime)
      if (paginationToken) {
        tweetsUrl.searchParams.append('pagination_token', paginationToken)
      }

      const tweetsResponse = await fetch(tweetsUrl.toString(), {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      })

      if (!tweetsResponse.ok) {
        throw new Error("Failed to fetch tweets")
      }

      const tweetsData = await tweetsResponse.json()
      if (tweetsData.data) {
        allTweets = [...allTweets, ...tweetsData.data]
      }

      paginationToken = tweetsData.meta?.next_token
      // Limit to 1000 tweets to avoid rate limits
      if (allTweets.length >= 1000) break
    } while (paginationToken)

    // Create a 52-week (year) activity array
    const activityData = new Array(371).fill(0) // 371 days = ~53 weeks
    const now = new Date()

    allTweets.forEach((tweet: any) => {
      const tweetDate = new Date(tweet.created_at)
      const daysAgo = Math.floor((now.getTime() - tweetDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysAgo < 371) {
        activityData[370 - daysAgo]++
      }
    })

    return NextResponse.json({
      activity: activityData,
      totalTweets: allTweets.length
    })
  } catch (error) {
    console.error("Error fetching Twitter data:", error)
    return NextResponse.json({ error: "Failed to fetch Twitter data" }, { status: 500 })
  }
}

