#!/bin/bash

push() {

  # Check if a commit message is provided as an argument
  if [ -z "$1" ]; then
  echo "Error: Please provide at least a commit message. "
  echo "Usage: $(basename $0) 'my commit message' 'repository name' "
  exit 1
  fi
  echo "$*"
  echo "$#"
  git add .
  git commit -m "$1"
 
  if [ -n "$2" ]; then
  	
  	git push "$2"
  else
  	git push
  fi
}


push "$1" "$2"
