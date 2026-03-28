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
    const response = await axios.get( `${BASE_URL}/${username}`);
    const $ = cheerio.load(response.data);
    const articles: Article[] = [];

    $(".ArticleList_title__").each((_, element) => {
        const title = $(element).text().trim();
        const url = $(element).closest("a").attr("href") ?? "";
        articles.push({ title, url, likes: 0 });
    });

    return articles;
}

const main = async () => {
    const username = "zenn";
    const articles = await zennFetch(username);
    console.log(articles)
}

main();
