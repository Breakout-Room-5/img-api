#!/bin/bash

API="http://localhost:4741"
URL_PATH="/memes"
TITLE="Hello World"
UPLOAD="s_yoshi.png"
TOKEN="830c62c9fad99d85b9709caa53709615"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "meme": {
      "title": "'"${TITLE}"'",
      "upload": {"'"${UPLOAD}"'"}
    }
  }'