import { zennFetch } from "./scraper.ts";

const username = process.argv[2];
if (!username) {
  console.error("使い方: npx ts-node main.ts <username>");
  process.exit(1);
}

const articles = await zennFetch(username);
console.log(articles);
