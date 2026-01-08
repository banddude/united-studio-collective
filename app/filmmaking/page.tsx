"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

const basePath = "";

interface Video {
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

const videos: Video[] = [
  {
    id: "1",
    title: "Remain On Hold",
    duration: "03:13",
    thumbnail: "https://img.youtube.com/vi/eGznsWwAf28/sddefault.jpg",
    videoId: "eGznsWwAf28",
    platform: "youtube",
    creator: "United Studio Collective",
    description: "Super 8 fashion film. Directed By: Evan Rene",
  },
  {
    id: "2",
    title: "United Studio Collective Reel",
    duration: "00:36",
    thumbnail: "https://static.wixstatic.com/media/2e5994_a7ef47d637bb48b29c7d90e283a85118~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_90/file.jpg",
    videoId: "NO4KgrvH4Dg",
    platform: "youtube",
    creator: "United Studio Collective",
    description: "United Studio Collective's Reel",
  },
  {
    id: "3",
    title: "Light / Dark",
    duration: "01:24",
    thumbnail: "https://static.wixstatic.com/media/963954_fd3646aa5154494a9dc98c2757b08cf9~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_90/file.jpg",
    videoId: "light-dark.mp4",
    platform: "local",
    creator: "United Studio Collective",
    description: "A collaboration of architecture and fashion\n\nDirected By: Ion Tong & Evan Rene\nProduced By: United Studio Collective\nDirector of Photography: Ion Tong\nFashion Designer/Artist: Simon\nModel: Jessie Rainbow\nMakeup Artist: Jena Mogensen, Sarai Diaz",
  },
  {
    id: "4",
    title: "Delikate Rayne Desert Fashion Shoot",
    duration: "01:55",
    thumbnail: "https://img.youtube.com/vi/yPN2Bydj7Ec/sddefault.jpg",
    videoId: "yPN2Bydj7Ec",
    platform: "youtube",
    creator: "Evan Rene",
    description: "Fashion shoot for Delikate Rayne.",
  },
  {
    id: "5",
    title: "The Seasons of Fall",
    duration: "03:30",
    thumbnail: "https://img.youtube.com/vi/Mwe9xCaLLBM/sddefault.jpg",
    videoId: "Mwe9xCaLLBM",
    platform: "youtube",
    creator: "United Studio Collective",
    description: "A piece of trash on the corner of the street. Oozing black goo floating in the Pacific. A recovery effort to save the animals. The continual hatred growing towards your fellow man.\n\nThe looming extinction of Mankind. We want. We need. We take. Without care, with no remorse.\n\nDirector: Ion Tong & Evan Rene\nProduced By: United Studio Collective\nProduced By: Evan Rene\nDP: Evan Rene\nTalent: Tommy Ice\nFirst AC: CPark Photogenix\nGaffer: Kane E. Thompson",
    backgroundSize: "125%",
  },
  {
    id: "6",
    title: "Blackmagic URSA Mini Pro Fashion Film: The Rae Sisters",
    duration: "00:59",
    thumbnail: "https://img.youtube.com/vi/HBXVsbKGq4s/sddefault.jpg",
    videoId: "HBXVsbKGq4s",
    platform: "youtube",
    creator: "United Studio Collective",
    description: "Using the Blackmagic URSA Mini Pro, we asked some friends to help us with a short fashion film/camera test. Featuring: The Rae Sisters.",
    backgroundSize: "125%",
  },
  {
    id: "7",
    title: "Through The Night",
    duration: "03:30",
    thumbnail: "https://img.youtube.com/vi/kg1EDL-O5zI/sddefault.jpg",
    videoId: "kg1EDL-O5zI",
    platform: "youtube",
    creator: "United Studio Collective",
    description: "Through The Night: A short film based on the feelings and emotions we all experience through life. Shown through the lens of a night drive through Los Angeles. Shot on, Blackmagic URSA Mini Pro.",
  },
  {
    id: "8",
    title: "A Friendship Divided",
    duration: "01:30",
    thumbnail: "https://static.wixstatic.com/media/963954_5d4dbea05d6b47f3bf62b0e182a08190~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_90/file.jpg",
    videoId: "534300555",
    platform: "vimeo",
    creator: "Ion Tong",
    description: "A collection of shots from various films shot by Ion Tong and Evan Rene. Directed by Ion Tong.",
    hidden: true,
  },
  {
    id: "9",
    title: "Box Chocolate: We Have Your Delivery",
    duration: "00:00",
    thumbnail: "https://i.vimeocdn.com/video/1401443224-d8abccfdb8e26a6ce6bd46eed625f0aa1baa9c3430aa65ab9bb4d3ba98fc085d-d_1920x1080",
    videoId: "",
    platform: "pending",
    creator: "Evan Rene",
    description: "We're Box Chocolate — but our friends just call us Box. We're a team of chocolate lovers based in Los Angeles, CA.\n\nDirected By: Evan Rene\nProduced By: United Studio Collective & Mike Shaffer\nDP: Ion Tong",
    hidden: true,
  },
];

export default function FilmmakingPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video>(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) && !video.hidden
  );

  const visibleThumbnails = 3;
  const maxIndex = Math.max(0, filteredVideos.length - visibleThumbnails);

  // Reset thumbnail index when search changes
  const previousSearchQuery = useRef(searchQuery);
  useEffect(() => {
    if (previousSearchQuery.current !== searchQuery) {
      previousSearchQuery.current = searchQuery;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThumbnailIndex(0);
    }
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
      // Keep playing state so video autoplays when navigating
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
      // Keep playing state so video autoplays when navigating
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
      <main className="flex-1 pt-[120px] md:pt-[150px]">
        {/* Main Video Player Section */}
        <div className="relative w-full z-10">
          {isPlaying ? (
            /* Video Embed with Info Panel */
            <div className="relative bg-black py-8">
              {/* Close button */}
              <button
                onClick={handleCloseVideo}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-20"
              >
                <X size={28} strokeWidth={1.5} />
              </button>

              {/* Previous Arrow */}
              {currentVideoIndex > 0 && (
                <button
                  onClick={handlePrevVideo}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-20"
                >
                  <ChevronLeft size={48} strokeWidth={1} />
                </button>
              )}

              {/* Next Arrow */}
              {currentVideoIndex < filteredVideos.length - 1 && (
                <button
                  onClick={handleNextVideo}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-20"
                >
                  <ChevronRight size={48} strokeWidth={1} />
                </button>
              )}

              <div className="max-w-6xl mx-auto px-16 md:px-24">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Video Player with border */}
                  <div className="relative w-full md:w-2/3 aspect-video bg-black shadow-lg">
                    {selectedVideo.platform === "youtube" ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                        title={selectedVideo.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : selectedVideo.platform === "vimeo" ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${selectedVideo.videoId}?autoplay=1`}
                        title={selectedVideo.title}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : selectedVideo.platform === "local" ? (
                      <video
                        src={`${basePath}/videos/${selectedVideo.videoId}`}
                        className="w-full h-full"
                        controls
                        autoPlay
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white relative">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${selectedVideo.thumbnail})`,
                            backgroundSize: selectedVideo.backgroundSize || 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <p className="text-white text-lg">Video coming soon</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Info Panel */}
                  <div className="w-full md:w-1/3 flex flex-col justify-start md:max-h-[50vh] md:overflow-y-auto">
                    <h3
                      className="text-white text-2xl md:text-3xl font-extralight mb-4"
                      style={{ fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif", fontWeight: 200 }}
                    >
                      {selectedVideo.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                      <span>{selectedVideo.creator}</span>
                      <span>•</span>
                      <span>{selectedVideo.duration}</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedVideo.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Original Full-Width Thumbnail Gallery */
            <div className="relative w-full aspect-video max-h-[70vh]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${selectedVideo.thumbnail})`,
                  backgroundSize: selectedVideo.backgroundSize || 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Centered Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                {/* Subtitle */}
                <p
                  className="text-white/80 uppercase mb-4 text-center"
                  style={{
                    fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(10px, 1.5vw, 16px)",
                    letterSpacing: "clamp(0.2em, 0.4vw, 0.3em)"
                  }}
                >
                  United Studio Collective
                </p>
                {/* Video Title */}
                <h2
                  className="text-white font-extralight italic mb-4 text-center"
                  style={{
                    fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 200,
                    fontSize: "clamp(18px, 4vw, 48px)"
                  }}
                >
                  {selectedVideo.title}
                </h2>
                <button
                  onClick={handlePlayVideo}
                  className="flex items-center justify-center text-white hover:opacity-80 transition-opacity group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Play className="w-7 h-7 md:w-8 md:h-8 ml-1" fill="white" />
                  </div>
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
                    className={`group cursor-pointer relative overflow-hidden aspect-video ${
                      selectedVideo.id === video.id ? "ring-2 ring-black" : ""
                    }`}
                    onClick={() => handleSelectVideo(video)}
                    style={{
                      backgroundImage: `url(${video.thumbnail})`,
                      backgroundSize: video.backgroundSize || 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
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
              ))}
          </div>

          {/* Navigation Arrows */}
          {thumbnailIndex > 0 && (
            <button
              onClick={handlePrevThumbnails}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors z-10"
            >
              <ChevronLeft size={32} strokeWidth={1.5} />
            </button>
          )}
          {thumbnailIndex < maxIndex && (
            <button
              onClick={handleNextThumbnails}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors z-10"
            >
              <ChevronRight size={32} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
