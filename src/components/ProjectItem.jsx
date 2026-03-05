import { useEffect, useRef, useState } from 'react';

const getYouTubeId = (url) => {
  if (!url) {
    return null;
  }

  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

function ProjectItem({ project, language, isExpanded, onClick }) {
  const title = language === 'es' ? project.title : project.title_en;
  const content = language === 'es' ? project.content : project.content_en;
  const videoSource =
    language === 'es'
      ? (project.video_es || project.video)
      : (project.video_en || project.video);
  const youtubeId = getYouTubeId(videoSource);
  const youtubeEmbedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0`
    : null;
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [imageSource, setImageSource] = useState(project.image);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isExpanded, language]);

  useEffect(() => {
    setVideoError(false);
  }, [project, language, isExpanded]);

  useEffect(() => {
    setIsVideoPlaying(false);
    setIsMuted(true);
    setVideoDuration(0);
    setVideoCurrentTime(0);
  }, [project, language, isExpanded]);

  useEffect(() => {
    setImageSource(project.image);
  }, [project, language]);

  const handleImageError = () => {
    if (project.image_fallback && imageSource !== project.image_fallback) {
      setImageSource(project.image_fallback);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClick();
  };

  const handleToggleVideoPlayback = (event) => {
    event.stopPropagation();

    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
      return;
    }

    video.pause();
  };

  const handleFullscreen = (event) => {
    event.stopPropagation();

    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => {});
      return;
    }

    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  };

  const handleVideoLoaded = () => {
    const video = videoRef.current;
    if (!video || !isExpanded) {
      return;
    }

    setVideoDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setVideoCurrentTime(video.currentTime || 0);

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        setIsVideoPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    setVideoCurrentTime(video.currentTime || 0);
  };

  const handleMetadataLoaded = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    setVideoDuration(Number.isFinite(video.duration) ? video.duration : 0);
  };

  const handleSeek = (event) => {
    event.stopPropagation();

    const video = videoRef.current;
    if (!video || !videoDuration) {
      return;
    }

    const nextTime = (Number(event.target.value) / 100) * videoDuration;
    video.currentTime = nextTime;
    setVideoCurrentTime(nextTime);
  };

  const handleToggleMute = (event) => {
    event.stopPropagation();

    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const progressPercent = videoDuration > 0
    ? Math.min(100, Math.max(0, (videoCurrentTime / videoDuration) * 100))
    : 0;

  return (
    <div
      className={`gallery-item ${isExpanded ? 'expanded' : ''}`}
      onClick={!isExpanded ? onClick : undefined}
    >
      <button
        className="close-button"
        onClick={handleClose}
        aria-label="Close"
      />

      <div className="project-image-container">
        {isExpanded && videoSource && !videoError ? (
          youtubeEmbedUrl ? (
            <iframe
              className="project-video"
              src={youtubeEmbedUrl}
              title={title}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              <video
                ref={videoRef}
                className="project-video"
                src={videoSource}
                poster={imageSource}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={handleVideoLoaded}
                onLoadedMetadata={handleMetadataLoaded}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onError={() => {
                  setVideoError(true);
                  setIsVideoPlaying(false);
                }}
              />
              <div className="video-controls-overlay">
                <button
                  type="button"
                  className="video-control-button video-center-control"
                  onClick={handleToggleVideoPlayback}
                  aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                  title={isVideoPlaying ? 'Pause' : 'Play'}
                >
                  {isVideoPlaying ? '❚❚' : '▶'}
                </button>

                <button
                  type="button"
                  className="video-control-button video-fullscreen-control"
                  onClick={handleFullscreen}
                  aria-label="Fullscreen"
                  title="Fullscreen"
                >
                  ⛶
                </button>

                <div className="video-bottom-controls">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progressPercent}
                    onChange={handleSeek}
                    onClick={(event) => event.stopPropagation()}
                    className="video-progress"
                    aria-label="Video progress"
                  />

                  <button
                    type="button"
                    className="video-control-button video-volume-control"
                    onClick={handleToggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                </div>
              </div>
            </>
          )
        ) : (
          <img
            src={imageSource}
            alt={title}
            className="project-image"
            loading="lazy"
            onError={handleImageError}
          />
        )}
        <div className="project-title-overlay">
          {title}
        </div>
      </div>

      <div className="content" ref={contentRef}>
        <h2>{title}</h2>
        <ul>
          {content.map((item, i) => (
            <li
              key={i}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProjectItem;