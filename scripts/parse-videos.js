const fs = require('fs');
const execSync = require('child_process').execSync;

const channelUrl = "https://www.youtube.com/@UnitedStudioCollective/videos";

// Local videos that aren't on YouTube
const localVideos = [
  {
    id: "light-dark",
    title: "Light / Dark",
    duration: "01:24",
    thumbnail: "https://static.wixstatic.com/media/963954_fd3646aa5154494a9dc98c2757b08cf9~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_90/file.jpg",
    videoId: "light-dark.mp4",
    platform: "local",
    creator: "United Studio Collective"
  }
];

try {
  // Fetch video data as JSON from yt-dlp
  const jsonOutput = execSync(
    `yt-dlp --dump-single-json --flat-playlist "${channelUrl}"`,
    { encoding: 'utf8' }
  );

  const data = JSON.parse(jsonOutput);
  const entries = data.entries || [];

  const youtubeVideos = entries.map((entry) => {
    const videoId = entry.id;
    const title = entry.title;
    const duration = entry.duration;

    // Format duration from seconds to MM:SS
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = Math.floor(duration % 60);
    const formattedDuration = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

    // Use YouTube thumbnail URL
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return {
      id: videoId,
      title: title,
      duration: formattedDuration,
      thumbnail: thumbnailUrl,
      videoId: videoId,
      platform: "youtube",
      creator: "United Studio Collective",
      description: entry.description || undefined
    };
  });

  // Merge: YouTube videos first (newest first), then local videos
  const allVideos = [...youtubeVideos, ...localVideos];

  console.log(JSON.stringify(allVideos, null, 2));
} catch (error) {
  console.error('Error fetching videos:', error.message);
  process.exit(1);
}
