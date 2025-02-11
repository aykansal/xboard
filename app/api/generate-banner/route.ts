import { NextResponse } from "next/server"
import sharp from "sharp"

export async function POST(request: Request) {
  const { username, activityData } = await request.json()

  try {
    const width = 1500
    const height = 500
    const barWidth = Math.floor(width / 30)
    const maxTweets = Math.max(...activityData)

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1DA1F2"/>
        <text x="20" y="40" font-family="Arial" font-size="24" fill="white">@${username}'s Twitter Activity</text>
        ${activityData
          .map((tweets, index) => {
            const barHeight = (tweets / maxTweets) * (height - 100)
            return `<rect x="${index * barWidth}" y="${height - barHeight}" width="${barWidth - 2}" height="${barHeight}" fill="white" opacity="0.8"/>`
          })
          .join("")}
      </svg>
    `

    const buffer = await sharp(Buffer.from(svg)).png().toBuffer()

    // In a real-world scenario, you would upload this buffer to a file storage service
    // and return the URL. For this example, we'll return a data URL.
    const dataUrl = `data:image/png;base64,${buffer.toString("base64")}`

    return NextResponse.json({ bannerUrl: dataUrl })
  } catch (error) {
    console.error("Error generating banner:", error)
    return NextResponse.json({ error: "Failed to generate banner" }, { status: 500 })
  }
}

