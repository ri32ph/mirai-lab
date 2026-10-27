# 健康習慣と薬

トップ → `content/health-habits/index.html` → `cholesterol-exercise.html`。
既存の「生活習慣を整えたい」は日々の工夫を扱い、本部門は健康習慣と治療の役割・関係を扱う。既存記事は変更しない。

## 編集・生成

- 第2回の原稿（ローカル確認用）：`content/health-habits/hypertension-salt.md`
- 第1回の原稿：`content/health-habits/cholesterol-exercise.md`
- 入口の文言・準備中のテーマ・共通ページ枠：`scripts/build-health-habits.mjs`
- デザイン：`content/health-habits/health-habits.css`（既存style.cssを利用し、部門内とトップ追加カードに限定して上書き）
- 生成：`node scripts/build-health-habits.mjs`（既存のmarked依存を使用）
- 依存を導入していないローカル環境では、`MIRAI_RUNTIME_NODE_MODULES` に既存のmarkedを含むnode_modulesを指定できる。

入口・記事は静的HTML。JavaScriptに依存せず、未作成5テーマにはリンクも本文も作らない。
既存のフラットイラストを再利用し、新たな画像・外部フォント・JavaScriptは追加しない。
各記事と入口は医療者による公開前確認待ちとし、noindex,nofollowを付ける。
第1回の定量説明・要点・折りたたみは2026-10-22にmainへ反映。第2回の本文と入口カードはローカルで確認後に公開する。

第3回の原稿（ローカル確認用）：`content/health-habits/diabetes-diet.md`。照合記録は `DIABETES_SOURCES.md`。第2・3回は公開前確認待ち。

第4回の原稿（ローカル確認用）：`content/health-habits/osteoporosis-calcium.md`。照合記録は `OSTEOPOROSIS_SOURCES.md`。第4回も公開前確認待ち。

第5回の原稿（ローカル確認用）：`content/health-habits/anemia-iron.md`。照合記録は `ANEMIA_SOURCES.md`。公開前確認待ち。

第6回の原稿（ローカル確認用）：`content/health-habits/constipation-fiber.md`。照合記録は `CONSTIPATION_SOURCES.md`。公開前確認待ち。

第1〜6回の図とカード：`visual-summaries.json` に要約・イラストを指定。本文Markdownの内容を変えた際は、要約も合わせて確認する。見せ方と検査の説明は `VISUAL_DESIGN.md`。このデザイン変更はローカル確認用。

## B：生活の中での関わりを知る（2026年10月22日）

Bの5記事をローカル確認用として追加しました。入口 `content/health-habits/index.html#influence` から開けます。記事一覧は `B_ARTICLES.json`、既存記事との分担・照合資料・公開前の確認点は `B_SOURCES.md` を参照してください。noindex・確認待ち表示を維持し、この追加分は未公開です。

## 飲み合わせをもっと詳しく知る

Bの5記事は基本編。`food-interactions-details.html` に詳しいページの入口を追加しました。薬や食品別の5記事の一覧は `DETAIL_ARTICLES.json`、照合資料・判断と公開前の確認点は `DETAIL_SOURCES.md` を参照。今回の追加分も確認待ち・未公開です。

## 参考文献の再評価

`REFERENCE_POLICY.md` に採用基準、`REFERENCE_AUDIT_20261022.md` に6記事の根拠差し替えと確認レベルを記録しました。本文の根拠と、追加調査の検索先は区別しています。高知市の表を根拠として使うことは取りやめています。

### 甲状腺と海藻・ヨウ素（2026-10-22）

詳しいページに `thyroid-iodine.md/html` を追加。普段の過剰摂取回避と、検査・治療前の制限を区別。食品・量・期間・薬の確認表、研究の限界を示す折りたたみを配置。照合記録は [THYROID_IODINE_SOURCES.md](THYROID_IODINE_SOURCES.md)。医療者確認用のローカル実装であり、公開はしていません。
