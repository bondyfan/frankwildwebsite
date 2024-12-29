#!/bin/bash

# Create mobile directory if it doesn't exist
mkdir -p public/carousel/mobile

# List of videos to compress
videos=("VSTDP" "hafo" "bunnyhop" "upirdex" "hot" "zabil")

# Compress each video
for video in "${videos[@]}"; do
    echo "Compressing $video..."
    ffmpeg -i "public/carousel/optimized/$video.mp4" \
        -vf "scale=480:-1" \
        -b:v 500k \
        -maxrate 600k \
        -bufsize 800k \
        -preset slow \
        -crf 28 \
        "public/carousel/mobile/$video.mp4"
done

echo "Done compressing all videos!"
