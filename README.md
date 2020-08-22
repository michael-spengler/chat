# Chat

Deno module for chat related challenges and solutions


## Usage Example including pm2 start

```sh

# copy .env-example.ts to .env.ts and update it with your ingredients  
deno run --allow-read --allow-net https://deno.land/x/chat/chat-server.ts

```

or via pm2 

```sh

git clone https://github.com/michael-spengler/chat.git
cd chat
echo [] > mappings.json  # only during your initial setup
pm2 start  --interpreter="deno" --interpreter-args="run --allow-net --allow-read --allow-write" chat-server.ts

```


## Support my Open Source Contributions  

If you like my work please consider downloading the brave browser via my promotion link: [https://brave.com/fan464](https://brave.com/fan464).  

![![](https://brave.com/fan464/)](https://brave.com/wp-content/uploads/2019/01/logotype-full-color.svg)

