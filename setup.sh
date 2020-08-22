git clone https://github.com/michael-spengler/chat.git
cd chat
echo [] > mappings.json
pm2 start  --interpreter="deno" --interpreter-args="run --allow-net --allow-read --allow-write" chat-server.ts