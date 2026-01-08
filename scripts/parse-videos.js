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

// Videos with custom thumbnails or special settings
const specialCases = {
  "NO4KgrvH4Dg": {
    thumbnail: "https://static.wixstatic.com/media/2e5994_a7ef47d637bb48b29c7d90e283a85118~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_90/file.jpg",
    description: "United Studio Collective's Reel"
  },
  "HBXVsbKGq4s": {
    backgroundSize: "135%"
  },
  "Mwe9xCaLLBM": {
    backgroundSize: "135%"
  }
};

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

    // Fetch full description for each video individually
    let fullDescription = entry.description;
    try {
      fullDescription = execSync(
        `yt-dlp --print "%(description)s" "https://www.youtube.com/watch?v=${videoId}"`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
      ).trim();
    } catch (e) {
      // Fall back to playlist description if fetch fails
      fullDescription = entry.description;
    }

    // Use sddefault for thumbnails (better than maxresdefault for avoiding black bars)
    const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

    // Apply special cases if any
    const special = specialCases[videoId] || {};

    return {
      id: videoId,
      title: title,
      duration: formattedDuration,
      thumbnail: special.thumbnail || defaultThumbnail,
      videoId: videoId,
      platform: "youtube",
      creator: "United Studio Collective",
      description: special.description || fullDescription || undefined,
      ...(special.backgroundSize && { backgroundSize: special.backgroundSize })
    };
  });

  // Merge: YouTube videos first (newest first), then local videos
  const allVideos = [...youtubeVideos, ...localVideos];

  console.log(JSON.stringify(allVideos, null, 2));
} catch (error) {
  console.error('Error fetching videos:', error.message);
  process.exit(1);
}
