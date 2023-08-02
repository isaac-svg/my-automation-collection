#!/bin/bash

push() {
  git add .
  git commit -m "$1"
  git push
}

# Check if a commit message is provided as an argument
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message as an argument."
  exit 1
fi

push "$1"
