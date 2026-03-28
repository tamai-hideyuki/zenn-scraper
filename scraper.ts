import axios from "axios";
import * as cheerio from "cheerio";


const BASE_URL = "https://zenn.dev";

type Article = {
    title: string;
    url: string;
    likes: number;
    emoji: string;
    author: string;
};

const zennFetch = async (username: string): Promise<Article[]> => {
  const response = await axios.get(`${BASE_URL}/articles?username=${username}&order=latest`);
  const $ = cheerio.load(response.data);
  const jsonText = $("#__NEXT_DATA__").text();
  const json = JSON.parse(jsonText);
  const articles: Article[] = json.props.pageProps.articles.map((a: any) => ({
    title: a.title,
    url: `https://zenn.dev${a.path}`,
    likes: a.likedCount,
    emoji: a.emoji,
    author: a.user.username,
}));

    return articles;
}

const main = async () => {
    const username = "zenn";
    const articles = await zennFetch(username);
    console.log(articles)
}

main();
