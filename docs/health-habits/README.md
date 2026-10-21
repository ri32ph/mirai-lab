# 健康習慣と薬

トップ → `content/health-habits/index.html` → `cholesterol-exercise.html`。
既存の「生活習慣を整えたい」は日々の工夫を扱い、本部門は健康習慣と治療の役割・関係を扱う。既存記事は変更しない。

## 編集・生成

- 第1回の原稿：`content/health-habits/cholesterol-exercise.md`
- 入口の文言・準備中のテーマ・共通ページ枠：`scripts/build-health-habits.mjs`
- デザイン：`content/health-habits/health-habits.css`（既存style.cssを利用し、部門内とトップ追加カードに限定して上書き）
- 生成：`node scripts/build-health-habits.mjs`（既存のmarked依存を使用）
- 依存を導入していないローカル環境では、`MIRAI_RUNTIME_NODE_MODULES` に既存のmarkedを含むnode_modulesを指定できる。

入口・記事は静的HTML。JavaScriptに依存せず、未作成10テーマにはリンクも本文も作らない。
既存のフラットイラストを再利用し、新たな画像・外部フォント・JavaScriptは追加しない。
新規2ページは医療者による公開前確認待ちとし、noindex,nofollowを付ける。
mainへのマージ・本番公開は行わない。
