#!/bin/bash

API="http://localhost:4741"
URL_PATH="/sign-out"
TOKEN="830c62c9fad99d85b9709caa53709615"

curl "${API}${URL_PATH}/" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
