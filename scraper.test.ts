import { describe, it, expect, vi, beforeEach } from "vitest";
import { zennFetch } from "./scraper.ts";
import axios from "axios";

vi.mock("axios");

const mockGet = vi.mocked(axios.get);

const fakeArticles = [{
  title: "テスト記事",
  path: "/test/articles/1",
  liked_count: 42,
  emoji: "🎉",
  user: { username: "testuser" },
}];

describe("zennFetch", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  describe("正常系", () => {
    it("記事を正しくパースできる", async () => {
      mockGet.mockResolvedValue({ data: { articles: fakeArticles } });

      const [article] = await zennFetch("testuser");

      expect(article).toStrictEqual({
        title: "テスト記事",
        url: "https://zenn.dev/test/articles/1",
        likes: 42,
        emoji: "🎉",
        author: "testuser",
      });
    });

    it("記事が0件の場合、空配列を返す", async () => {
      mockGet.mockResolvedValue({ data: { articles: [] } });

      const articles = await zennFetch("testuser");
      expect(articles).toStrictEqual([]);
    });
  });

  describe("異常系", () => {
    it("記事データの構造が想定と異なる場合エラーになる", async () => {
      mockGet.mockResolvedValue({ data: {} });
      await expect(zennFetch("testuser")).rejects.toThrow("記事データの構造が想定と異なります");
    });

    it("ネットワークエラー時にエラーになる", async () => {
      mockGet.mockRejectedValue(new Error("Network Error"));
      await expect(zennFetch("testuser")).rejects.toThrow("記事の取得に失敗しました");
    });
  });
});
