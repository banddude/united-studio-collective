"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
}

const videos: Video[] = [
  {
    id: "1",
    title: "United Studio Collective 2024 Reel",
    duration: "00:36",
    thumbnail: "https://img.youtube.com/vi/NO4KgrvH4Dg/maxresdefault.jpg",
    youtubeId: "NO4KgrvH4Dg",
  },
  {
    id: "2",
    title: "Light / Dark",
    duration: "01:24",
    thumbnail: "https://img.youtube.com/vi/NO4KgrvH4Dg/maxresdefault.jpg",
    youtubeId: "NEEDS_YOUTUBE_UPLOAD", // TODO: Evan needs to upload this to YouTube
  },
  {
    id: "3",
    title: "Delikate Rayne Fashion Shoot",
    duration: "01:54",
    thumbnail: "https://img.youtube.com/vi/yPN2Bydj7Ec/maxresdefault.jpg",
    youtubeId: "yPN2Bydj7Ec",
  },
  {
    id: "4",
    title: "The Seasons of Fall",
    duration: "03:30",
    thumbnail: "https://img.youtube.com/vi/Mwe9xCaLLBM/maxresdefault.jpg",
    youtubeId: "Mwe9xCaLLBM",
  },
  {
    id: "5",
    title: "Blackmagic URSA Mini Pro Fashion Film: The Rae Sisters",
    duration: "00:59",
    thumbnail: "https://img.youtube.com/vi/HBXVsbKGq4s/maxresdefault.jpg",
    youtubeId: "HBXVsbKGq4s",
  },
  {
    id: "6",
    title: "Through The Night",
    duration: "03:30",
    thumbnail: "https://img.youtube.com/vi/kg1EDL-O5zI/maxresdefault.jpg",
    youtubeId: "kg1EDL-O5zI",
  },
  {
    id: "7",
    title: "A Friendship Divided",
    duration: "01:30",
    thumbnail: "https://img.youtube.com/vi/kg1EDL-O5zI/maxresdefault.jpg",
    youtubeId: "NEEDS_YOUTUBE_UPLOAD", // TODO: Evan needs to upload this to YouTube
  },
  {
    id: "8",
    title: "Box Chocolate: We Have Your Delivery",
    duration: "00:00",
    thumbnail: "https://img.youtube.com/vi/kg1EDL-O5zI/maxresdefault.jpg",
    youtubeId: "NEEDS_YOUTUBE_UPLOAD", // TODO: Evan needs to upload this to YouTube
  },
];

export default function FilmmakingPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video>(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleThumbnails = 3;
  const maxIndex = Math.max(0, filteredVideos.length - visibleThumbnails);

  // Reset thumbnail index when search changes
  useEffect(() => {
    setThumbnailIndex(0);
  }, [searchQuery]);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
  };

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  // Get current index of selected video in filtered list
  const currentVideoIndex = filteredVideos.findIndex(v => v.id === selectedVideo.id);

  const handleNextVideo = () => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      const nextVideo = filteredVideos[currentVideoIndex + 1];
      setSelectedVideo(nextVideo);
      setIsPlaying(false);
      // Auto-scroll thumbnails to keep selected video visible
      if (currentVideoIndex + 1 >= thumbnailIndex + visibleThumbnails) {
        setThumbnailIndex(prev => Math.min(prev + 1, maxIndex));
      }
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      const prevVideo = filteredVideos[currentVideoIndex - 1];
      setSelectedVideo(prevVideo);
      setIsPlaying(false);
      // Auto-scroll thumbnails to keep selected video visible
      if (currentVideoIndex - 1 < thumbnailIndex) {
        setThumbnailIndex(prev => Math.max(prev - 1, 0));
      }
    }
  };

  const handleNextThumbnails = () => {
    setThumbnailIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrevThumbnails = () => {
    setThumbnailIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header variant="light" currentPage="Filmmaking" />

      {/* Main Content */}
      <main className="flex-1 pt-[120px] md:pt-[160px]">
        {/* Main Video Player Section */}
        <div className="relative w-full aspect-video max-h-[70vh] z-10">
          {isPlaying ? (
            /* YouTube Embed */
            <div className="absolute inset-0 bg-black z-20">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={handleCloseVideo}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              >
                <X size={24} />
              </button>
            </div>
          ) : (
            /* Thumbnail with Play Button */
            <div className="absolute inset-0">
              <Image
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Centered Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Subtitle */}
                <p
                  className="text-white/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4"
                  style={{ fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif" }}
                >
                  United Studio Collective
                </p>
                {/* Video Title */}
                <h2
                  className="text-white text-3xl md:text-4xl lg:text-5xl font-light italic mb-8 text-center px-4"
                  style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
                >
                  {selectedVideo.title}
                </h2>
                <button
                  onClick={handlePlayVideo}
                  className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity group"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Play className="w-6 h-6 ml-1" fill="white" />
                  </div>
                  <span className="text-lg underline underline-offset-4">
                    Play Video
                  </span>
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search video..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-b border-white/50 text-white placeholder-white/70 py-2 px-1 w-48 focus:outline-none focus:border-white text-sm"
                  />
                </div>

              </div>

              {/* Previous Video Arrow */}
              {currentVideoIndex > 0 && (
                <button
                  onClick={handlePrevVideo}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                >
                  <ChevronLeft size={48} strokeWidth={1} />
                </button>
              )}

              {/* Next Video Arrow */}
              {currentVideoIndex < filteredVideos.length - 1 && (
                <button
                  onClick={handleNextVideo}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                >
                  <ChevronRight size={48} strokeWidth={1} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Video Thumbnails Strip */}
        <div className="bg-white relative">
          <div className="grid grid-cols-3 gap-0">
            {filteredVideos
              .slice(thumbnailIndex, thumbnailIndex + visibleThumbnails)
              .map((video) => (
                <div
                  key={video.id}
                  className={`group cursor-pointer relative overflow-hidden ${
                    selectedVideo.id === video.id ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => handleSelectVideo(video)}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                        <h4 className="text-white text-sm font-medium mb-2 px-4">
                          {video.title}
                        </h4>
                        <span className="text-white/80 text-xs">
                          {video.duration}
                        </span>
                        <div className="mt-3">
                          <Play className="w-10 h-10 text-white mx-auto" />
                        </div>
                        <span className="text-white text-sm mt-2 block">
                          Play Video
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Navigation Arrows */}
          {thumbnailIndex > 0 && (
            <button
              onClick={handlePrevThumbnails}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors z-10"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {thumbnailIndex < maxIndex && (
            <button
              onClick={handleNextThumbnails}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors z-10"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
