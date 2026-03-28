import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://zenn.dev";

export type Article = {
  title: string;
  url: string;
  likes: number;
  emoji: string;
  author: string;
};

type ZennArticle = {
  title: string;
  path: string;
  likedCount: number;
  emoji: string;
  user: { username: string };
};

type ZennNextData = {
  props: {
    pageProps: {
      articles: ZennArticle[];
    };
  };
};

export const zennFetch = async (username: string): Promise<Article[]> => {
  const response = await axios
    .get(`${BASE_URL}/articles?username=${username}&order=latest`)
    .catch((error) => {
      throw new Error(`記事の取得に失敗しました (${error.message})`);
    });

  const document = cheerio.load(response.data);
  const jsonText = document("#__NEXT_DATA__").text();
  if (!jsonText) {
    throw new Error(
      "__NEXT_DATA__ が見つかりません。Zennの仕様が変わった可能性があります",
    );
  }

  let nextData: ZennNextData;
  try {
    nextData = JSON.parse(jsonText) as ZennNextData;
  } catch {
    throw new Error("__NEXT_DATA__ のJSONパースに失敗しました");
  }

  const articles = nextData.props?.pageProps?.articles;
  if (!Array.isArray(articles)) {
    throw new Error("記事データの構造が想定と異なります");
  }

  return articles.map((article) => ({
    title: article.title,
    url: `https://zenn.dev${article.path}`,
    likes: article.likedCount,
    emoji: article.emoji,
    author: article.user.username,
  }));
};
