#!/bin/bash

# Create optimized directory if it doesn't exist
mkdir -p public/carousel/optimized

# Optimize each video
for video in public/carousel/*.mp4; do
  if [[ $video != *"optimized"* ]]; then
    filename=$(basename "$video")
    echo "Optimizing $filename..."
    ffmpeg -i "$video" \
      -c:v libx264 \
      -crf 23 \
      -preset medium \
      -movflags +faststart \
      -profile:v baseline \
      -level 3.0 \
      -maxrate 2M \
      -bufsize 2M \
      -vf "scale=1280:-2" \
      -c:a aac \
      -b:a 128k \
      "public/carousel/optimized/$filename"
  fi
done

echo "Optimization complete!"
