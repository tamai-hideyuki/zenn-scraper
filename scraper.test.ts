import { describe, it, expect, vi, beforeEach } from "vitest";
import { zennFetch } from "./scraper.ts";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const fakeArticles = [{
  title: "テスト記事",
  path: "/test/articles/1",
  liked_count: 42,
  emoji: "🎉",
  user: { username: "testuser" },
}];

const mockResponse = (data: object, ok = true, status = 200) => ({
  ok,
  status,
  json: () => Promise.resolve(data),
});

describe("zennFetch", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("正常系", () => {
    it("記事を正しくパースできる", async () => {
      mockFetch.mockResolvedValue(mockResponse({ articles: fakeArticles }));

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
      mockFetch.mockResolvedValue(mockResponse({ articles: [] }));

      const articles = await zennFetch("testuser");
      expect(articles).toStrictEqual([]);
    });
  });

  describe("異常系", () => {
    it("記事データの構造が想定と異なる場合エラーになる", async () => {
      mockFetch.mockResolvedValue(mockResponse({}));
      await expect(zennFetch("testuser")).rejects.toThrow("記事データの構造が想定と異なります");
    });

    it("HTTPエラー時にステータスコード付きでエラーになる", async () => {
      mockFetch.mockResolvedValue(mockResponse({}, false, 404));
      await expect(zennFetch("testuser")).rejects.toThrow("記事の取得に失敗しました (404)");
    });
  });
});
