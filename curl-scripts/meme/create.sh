#!/bin/bash

API="http://localhost:4741"
URL_PATH="/memes"
TITLE="Hello World"
UPLOAD="image=@/Users/rzheng/sei/projects/img-api/s_yoshi.png"
TOKEN="bc6244245d4c8aa7829937f1cbad07c6"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "meme": {
      "title": "'"${TITLE}"'"
    }
  }'