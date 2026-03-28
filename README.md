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

### package.json
- "type": "module" でトップレベル await が使える
- "main": "index.js" は実態と合っていなければ削除・修正すべき
- scripts に start / test を定義しておくと実行が楽になる
