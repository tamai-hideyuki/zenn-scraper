import { describe, it, expect, vi, beforeEach } from "vitest";
import { zennFetch } from "./scraper.ts";
import axios from "axios";

vi.mock("axios");

const mockGet = vi.mocked(axios.get);

const createHtml = (nextData?: object) =>
  nextData
    ? `<html><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(nextData)}</script></html>`
    : "<html></html>";

const fakePageData = {
  props: { pageProps: { articles: [{
    title: "テスト記事",
    path: "/test/articles/1",
    likedCount: 42,
    emoji: "🎉",
    user: { username: "testuser" },
  }] } },
};

describe("zennFetch", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  describe("正常系", () => {
    it("記事を正しくパースできる", async () => {
      mockGet.mockResolvedValue({ data: createHtml(fakePageData) });

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
      mockGet.mockResolvedValue({
        data: createHtml({ props: { pageProps: { articles: [] } } }),
      });

      const articles = await zennFetch("testuser");
      expect(articles).toStrictEqual([]);
    });
  });

  describe("異常系", () => {
    it("__NEXT_DATA__ がない場合エラーになる", async () => {
      mockGet.mockResolvedValue({ data: createHtml() });
      await expect(zennFetch("testuser")).rejects.toThrow("__NEXT_DATA__ が見つかりません");
    });

    it("ネットワークエラー時にエラーになる", async () => {
      mockGet.mockRejectedValue(new Error("Network Error"));
      await expect(zennFetch("testuser")).rejects.toThrow("記事の取得に失敗しました");
    });
  });
});
