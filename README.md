# 技術的に学んだこと

### cheerioの限界：
- 静的HTMLしか読めない。
- Next.jsのSSRページは最初空振りした。
- 「動的か静的か」を最初に判断する目が必要。

### __NEXT_DATA__ の存在：
- Next.jsはSSR時にページデータをHTMLに埋め込む。
- スクレイピングの文脈だとこれを知ってるかどうかで詰まる時間が全然違う。
- 今後Next.js製サイトをスクレイピングするときの引き出しになった。

### セレクタの設計：
- [class*='xxx'] の部分一致でハッシュ変化に耐える書き方。
- 壊れにくいコードの書き方として汎用的に使える。

### TypeScript / tsconfig
- "types": [] にすると @types/node 等が無効化される → 使うなら ["node"] を指定
- "jsx": "react-jsx" はReact未使用なら不要
- "declaration" / "declarationMap" はライブラリでなければ不要
- "noEmit": true にすれば "allowImportingTsExtensions": true が使える
- "sourceMap": true は noEmit: true の時には意味がない

### コード設計
- エントリポイント (main.ts) とロジック (scraper.ts) を分離すると、テスト時に main() が走らなくなる
- any は unknown + 型定義 (as Type) で排除できる
- 省略名 ($, a, err) よりフルネーム (document, article, error) の方が可読性が高い

### エラーハンドリング
- 外部API呼び出しは必ずエラーをキャッチし、原因がわかるメッセージをつける
- HTML構造の変更（__NEXT_DATA__ の消失）も想定して防御する
- JSON.parse は try-catch で囲む

### テスト (vitest)
- vi.mock("axios") でHTTPリクエストをモックできる
- vi.mocked(axios.get) を変数に取り出すと繰り返しが減る
- beforeEach で mockReset() してテスト間の副作用を防ぐ
- describe で正常系・異常系を分けると見通しが良い
- toStrictEqual で構造全体を一括検証できる
- rejects.toThrow("メッセージ") でエラーメッセージも検証できる
- テストデータ生成はヘルパー関数 (createHtml) にまとめると簡潔になる

### Zenn スクレイピングの知見
- https://zenn.dev/articles?username=xxx（HTMLページ）は username パラメータを無視して全体の最新記事を返す
- https://zenn.dev/api/articles?username=xxx（API）を使えば正しくユーザーの記事が返る
- APIのフィールド名はスネークケース（liked_count）、HTMLの __NEXT_DATA__ 内はキャメルケース（likedCount）だった

### 設計判断
- 公開APIがあるなら、HTMLパースよりAPIを使う方がシンプルで壊れにくい
- APIに切り替えたことで cheerio が不要になり、依存パッケージが削減できた
- スクレイピングは実際のレスポンスを確認してから実装すべき（username パラメータが効いていなかった）

### ESM 関連
- "type": "module" を package.json に追加するとトップレベル await が使える
- ただし ts-node は ESM モードで .ts を扱えない → tsx に置き換えるのが簡単

### 依存パッケージの見直し
- Node.js 18以降は fetch が標準で使えるので、axiosは不要
- APIを直接叩くなら cheerio（HTMLパーサー）も不要
- 結果として dependencies がゼロになり、プロジェクトがシンプルになった

### fetch と axios の違い
- fetch はエラー時に例外を投げず、response.ok / response.status で判定する
- axios は 4xx/5xx で自動的に例外を投げる

### テストでの fetch モック
- vi.stubGlobal("fetch", mockFn) でグローバルの fetch をモックできる
- axios の vi.mock("axios") よりも、レスポンスオブジェクト（ok, status, json()）を自分で組む必要がある

### package.json
- "main": "index.js" は実態と合っていなければ削除・修正すべき
- scripts に start / test を定義しておくと実行が楽になる
