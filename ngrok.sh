#!/usr/bin/env bash

# Start NGROK in background
echo "⚡️ Starting ngrok"
ngrok http 3000 > /dev/null &

# Wait for ngrok to be available
while ! nc -z localhost 4040; do
  sleep 1 # wait for Ngrok to be available
done

# Get NGROK dynamic URL from its own exposed local API
NGROK_REMOTE_URL="$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')"
if [[ -z "${NGROK_REMOTE_URL}" ]]; then
  echo "❌ ERROR: ngrok doesn't seem to return a valid URL (${NGROK_REMOTE_URL})."
  exit 1
fi

# Extract only the domain part from the URL
NGROK_DOMAIN=$(echo ${NGROK_REMOTE_URL} | awk -F/ '{print $3}')

# Updating Twilio phone number with the new ngrok URL
twilio phone-numbers:update +3197010207069 --voice-url=https://${NGROK_DOMAIN}/incoming
# Updating .env file with the new ngrok URL
PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
ENV_FILE="${PARENT_PATH}/.env"
sed -i.bak "s|SERVER=.*|SERVER=\"${NGROK_DOMAIN}\"|" "${ENV_FILE}"

echo "🔗 NGROK URL set to ${NGROK_DOMAIN} in .env file and updated for Twilio phone number"
