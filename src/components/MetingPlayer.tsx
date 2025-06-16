import React, { useEffect, useRef } from 'react';
import APlayer from 'aplayer';
import { config } from '../config/config';

/**
 * MetingPlayer Component
 * 
 * A React wrapper that creates a music player with configurable settings.
 * Supports both local audio files and online music platforms via MetingJS.
 * All configuration is read from the global config file (config.yaml).
 * 
 * Features:
 * - Local audio file playback (using APlayer directly)
 * - Online music platforms (NetEase, Tencent, Kugou, etc.) via MetingJS
 * - Configurable position (bottom-left, bottom-right, top-left, top-right)
 * - Customizable theme, volume, autoplay, and display options
 * - Automatic cleanup on component unmount
 * - Only renders when audioPlayer is enabled in config
 */

interface MetingPlayerProps {
  server?: string;
  type?: string;
  id?: string;
  fixed?: boolean;
  mini?: boolean;
  autoplay?: boolean;
  theme?: string;
  loop?: string;
  order?: string;
  preload?: string;
  volume?: number;
  mutex?: boolean;
  lrcType?: number;
  listFolded?: boolean;
  listMaxHeight?: string;
}

const MetingPlayer: React.FC<MetingPlayerProps> = () => {
  const playerRef = useRef<HTMLDivElement>(null);
  const aplayerInstanceRef = useRef<APlayer | null>(null);

  // Get position style from config
  const getPositionStyle = () => {
    const position = config.audioPlayer?.position || 'bottom-left';
    const baseStyle = {
      position: 'fixed' as const,
      zIndex: 1000
    };

    switch (position) {
      case 'bottom-left':
        return { ...baseStyle, bottom: '20px', left: '20px' };
      case 'bottom-right':
        return { ...baseStyle, bottom: '20px', right: '20px' };
      case 'top-left':
        return { ...baseStyle, top: '20px', left: '20px' };
      case 'top-right':
        return { ...baseStyle, top: '20px', right: '20px' };
      default:
        return { ...baseStyle, bottom: '20px', left: '20px' };
    }
  };

  useEffect(() => {
    // Check if audio player is enabled
    if (!config.audioPlayer?.enabled || !playerRef.current) {
      return;
    }

    const audioPlayerConfig = config.audioPlayer;

    // Check if we should use MetingJS for online music or APlayer for local files
    if (audioPlayerConfig.meting?.enabled) {
      // Use MetingJS for online music platforms
      const metingConfig = audioPlayerConfig.meting;

      // Create meting element
      const metingElement = document.createElement('meting-js');
      
      // Set attributes from config
      metingElement.setAttribute('server', metingConfig.server);
      metingElement.setAttribute('type', metingConfig.type);
      metingElement.setAttribute('id', String(metingConfig.id));
      metingElement.setAttribute('fixed', audioPlayerConfig.fixed ? 'true' : 'false');
      metingElement.setAttribute('mini', 'true');
      metingElement.setAttribute('autoplay', 'false'); // Avoid browser blocking
      metingElement.setAttribute('theme', audioPlayerConfig.theme || '#b7daff');
      metingElement.setAttribute('loop', metingConfig.loop || 'all');
      metingElement.setAttribute('order', metingConfig.order || 'list');
      metingElement.setAttribute('preload', metingConfig.preload || 'auto');
      metingElement.setAttribute('volume', String(audioPlayerConfig.volume || 0.7));
      metingElement.setAttribute('mutex', metingConfig.mutex !== false ? 'true' : 'false');
      metingElement.setAttribute('lrc-type', audioPlayerConfig.showLrc ? '3' : '0');
      metingElement.setAttribute('list-folded', metingConfig.listFolded ? 'true' : 'false');
      metingElement.setAttribute('list-max-height', metingConfig.listMaxHeight || '340px');

      // Append to container
      if (playerRef.current) {
        playerRef.current.appendChild(metingElement);
      }

      // Cleanup function for MetingJS
      return () => {
        if (playerRef.current && metingElement) {
          playerRef.current.removeChild(metingElement);
        }
      };
    } else {
      // Use APlayer for local audio files
      const baseUrl = import.meta.env.BASE_URL || '/';
      const processedAudio = audioPlayerConfig.audio?.map(track => ({
        name: track.name,
        artist: track.artist,
        url: track.url.startsWith('http') ? track.url : `${baseUrl}${track.url.replace(/^\//, '')}`,
        cover: track.cover.startsWith('http') ? track.cover : `${baseUrl}${track.cover.replace(/^\//, '')}`
      })) || [];

      // Initialize APlayer with configuration
      aplayerInstanceRef.current = new APlayer({
        container: playerRef.current,
        audio: processedAudio,
        autoplay: false, // Avoid browser blocking
        theme: audioPlayerConfig.theme || '#b7daff',
        loop: 'all',
        order: 'list',
        preload: 'auto',
        volume: audioPlayerConfig.volume !== undefined ? audioPlayerConfig.volume : 0.7,
        listFolded: false,
        listMaxHeight: '340px',
        lrcType: audioPlayerConfig.showLrc ? 3 : 0,
        fixed: audioPlayerConfig.fixed,
        mini: true // Always use mini mode
      });

      // Try to fix APlayer's non-passive touch events after initialization
      setTimeout(() => {
        try {
          const aplayerElements = playerRef.current?.querySelectorAll('.aplayer, .aplayer *');
          if (aplayerElements) {
            // This is a workaround attempt - may not work with all APlayer versions
            // The warning is from APlayer's internal implementation and cannot be fully resolved
            // without modifying the library itself
            console.log('APlayer elements found:', aplayerElements.length);
          }
        } catch (error) {
          // Silently ignore - this is just an optimization attempt
        }
      }, 100);

      // Cleanup function for APlayer
      return () => {
        if (aplayerInstanceRef.current) {
          aplayerInstanceRef.current.destroy();
          aplayerInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Don't render if audio player is disabled
  if (!config.audioPlayer?.enabled) {
    return null;
  }

  return (
    <div 
      ref={playerRef} 
      id="music-player"
      style={getPositionStyle()}
    />
  );
};

export default MetingPlayer;