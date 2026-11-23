/**
 * Extracts lightweight image frames at regular intervals across a video file
 * using an off-screen HTML5 <canvas>. This enables 100% real visual analysis
 * by Gemini Vision without uploading massive video files to serverless functions.
 */
export async function extractVideoFrames(
  file: File,
  maxFrames = 20,
  onProgress?: (percent: number) => void
): Promise<{ timestamp: number; data: string }[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration || 60;
        const interval = Math.max(1, duration / maxFrames);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale down to 640x360 for high visual fidelity and low payload (~20KB/frame)
        const targetWidth = 640;
        const targetHeight = Math.round((video.videoHeight / video.videoWidth) * targetWidth) || 360;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const frames: { timestamp: number; data: string }[] = [];

        for (let i = 0; i < maxFrames; i++) {
          const time = Math.min(Math.max(0, duration - 0.5), i * interval);
          video.currentTime = time;

          await new Promise<void>((res) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              res();
            };
            video.addEventListener('seeked', onSeeked);
          });

          if (ctx) {
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
            // 0.65 JPEG quality produces sharp frames under 25KB
            const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
            const base64Data = dataUrl.split(',')[1];
            frames.push({
              timestamp: Math.round(time),
              data: base64Data,
            });
          }

          if (onProgress) {
            onProgress(Math.round(((i + 1) / maxFrames) * 100));
          }
        }

        URL.revokeObjectURL(url);
        resolve(frames);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to read video file. Please ensure it is a valid MP4, MOV, or WebM format.'));
    };
  });
}

/**
 * Normalizes any YouTube URL or shortcode to standard https://www.youtube.com/watch?v=VIDEO_ID
 */
export function normalizeYouTubeUrl(url: string): { normalizedUrl: string; videoId: string } | null {
  if (!url) return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  if (match && match[2].length === 11) {
    const videoId = match[2];
    return {
      videoId,
      normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }
  return null;
}
