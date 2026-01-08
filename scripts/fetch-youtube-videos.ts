import { youtube_v3 } from "googleapis";
import { writeFileSync } from "fs";

const CHANNEL_ID = "UCyAKDtnnarGJONPStFvcQRw";

interface YouTubeVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoId: string;
  platform: "youtube" | "vimeo" | "local" | "pending";
  creator?: string;
  description?: string;
  backgroundSize?: string;
  hidden?: boolean;
}

async function fetchYouTubeVideos(apiKey: string): Promise<YouTubeVideo[]> {
  const youtube = youtube_v3.youtube({
    version: "v3",
    auth: apiKey,
  });

  try {
    // Get all videos from the channel
    const channelResponse = await youtube.channels.list({
      id: CHANNEL_ID,
      part: ["contentDetails"],
    });

    const uploadsPlaylistId =
      channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error("Could not find uploads playlist");
    }

    // Fetch all videos from the uploads playlist
    const videos: YouTubeVideo[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
      const playlistResponse = await youtube.playlistItems.list({
        playlistId: uploadsPlaylistId,
        part: ["snippet", "contentDetails"],
        maxResults: 50,
        pageToken: nextPageToken,
      });

      const items = playlistResponse.data.items || [];

      for (const item of items) {
        const videoId = item.contentDetails?.videoId;
        const title = item.snippet?.title;
        const description = item.snippet?.description;
        const thumbnail = item.snippet?.thumbnails?.maxres?.url ||
                         item.snippet?.thumbnails?.standard?.url ||
                         item.snippet?.thumbnails?.high?.url ||
                         item.snippet?.thumbnails?.medium?.url ||
                         item.snippet?.thumbnails?.default?.url ||
                         `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

        // Get video details for duration
        let duration = "00:00";
        try {
          const videoResponse = await youtube.videos.list({
            id: videoId,
            part: ["contentDetails"],
          });
          const durationRaw = videoResponse.data.items?.[0]?.contentDetails?.duration;
          if (durationRaw) {
            duration = formatDuration(durationRaw);
          }
        } catch (e) {
          // Skip if duration fetch fails
        }

        if (videoId && title) {
          videos.push({
            id: videoId,
            title,
            duration,
            thumbnail,
            videoId,
            platform: "youtube",
            creator: "United Studio Collective",
            description: description || undefined,
          });
        }
      }

      nextPageToken = playlistResponse.data.nextPageToken;
    } while (nextPageToken);

    return videos.reverse(); // Show newest first
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
}

function formatDuration(duration: string): string {
  // Parse ISO 8601 duration (e.g., PT3M14S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error("YOUTUBE_API_KEY environment variable is not set");
    process.exit(1);
  }

  console.log("Fetching videos from YouTube channel...");
  const videos = await fetchYouTubeVideos(apiKey);

  console.log(`Found ${videos.length} videos`);

  // Write to JSON file
  const outputPath = `${__dirname}/../app/filmmaking/videos.json`;
  writeFileSync(outputPath, JSON.stringify(videos, null, 2));

  console.log(`Videos written to ${outputPath}`);
}

main().catch(console.error);
