#!/bin/bash

# Downloads source directory
SOURCE_DIR="/home/isaac/Downloads/"

# Destination directories based on file types
DOCUMENTS_DIR="/home/isaac/Downloads/documents"
IMAGES_DIR="/home/isaac/Downloads/images"
MUSIC_DIR="/home/isaac/Downloads/music"
VIDEOS_DIR="/home/isaac/Downloads/videos"
ARCHIVES_DIR="/home/isaac/Downloads/archives"
OTHER_DIR="/home/isaac/Downloads/others"

# Create the destination directories if they don't exist
mkdir -p "$DOCUMENTS_DIR" "$IMAGES_DIR" "$MUSIC_DIR" "$VIDEOS_DIR" "$ARCHIVES_DIR" "$OTHER_DIR"

count=0
# Move files to their respective directories based on file type
for file in "$SOURCE_DIR"/*; do
    if [ -f "$file" ]; then
        case "$(file -b --mime-type "$file")" in
            application/pdf)
                mv "$file" "$DOCUMENTS_DIR" ;;
            image/*)
                mv "$file" "$IMAGES_DIR" ;;
            audio/*)
                mv "$file" "$MUSIC_DIR" ;;
            video/*)
                mv "$file" "$VIDEOS_DIR" ;;
            application/zip|application/x-rar-compressed|application/x-7z-compressed)
                mv "$file" "$ARCHIVES_DIR" ;;
            *)
                mv "$file" "$OTHER_DIR" ;;
        esac
        ((count++))
    fi
done

echo "$count files rearranged"
