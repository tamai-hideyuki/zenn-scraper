import axios from "axios";

const API_URL = "https://zenn.dev/api";

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
  liked_count: number;
  emoji: string;
  user: { username: string };
};

type ZennResponse = {
  articles: ZennArticle[];
};

export const zennFetch = async (username: string): Promise<Article[]> => {
  const response = await axios
    .get<ZennResponse>(`${API_URL}/articles?username=${username}&order=latest`)
    .catch((error) => {
      throw new Error(`記事の取得に失敗しました (${error.message})`);
    });

  const articles = response.data.articles;
  if (!Array.isArray(articles)) {
    throw new Error("記事データの構造が想定と異なります");
  }

  return articles.map((article) => ({
    title: article.title,
    url: `https://zenn.dev${article.path}`,
    likes: article.liked_count,
    emoji: article.emoji,
    author: article.user.username,
  }));
};
