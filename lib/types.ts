export interface Tweet {
    tweetId: string;
    tweet: string;
    created_at: string;
}

export interface activityProps {
    activityData: Tweet[]
    username?: string
}
