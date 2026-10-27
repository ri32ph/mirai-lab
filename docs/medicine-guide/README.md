# 薬・市販薬・サプリメントの入口

2026年10月21日追加。既存の `content/medicine-guide/index.html` と8章のURLを維持し、共通入口に3枚のカードを設けた。本文はHTMLに直接記載しており、JavaScriptなしでも辿って読める。

- 処方された薬：同ページの `#prescribed` から既存の8章へ。8章の構成とURLを維持。安全性・相談の章に、重複・相互作用の補足と関連リンクを追加。
- 市販薬：`content/medicine-guide/otc.html`
- サプリメント：`content/medicine-guide/supplements.html`

トップの医療メニュー、`find.html` の説明も更新した。今後は各説明ページから個別テーマの記事へ拡張できる。Q&A・記事検索の対象に、共通解説15ページを追加。本文・キーワードからも該当記事を見つけられるようにした。

## 照合資料

確認日：2026年10月21日。各ページ末尾にも主要出典を表示した。

|資料|確認した内容|
|---|---|
|[PMDA：市販薬の注意](https://www.pmda.go.jp/safety/consultation-for-patients/on-drugs/qa/0011.html)|説明書の確認、治療中・妊娠・授乳等の相談、漫然と使い続けないこと|
|[PMDA：処方薬と市販薬の違い](https://www.pmda.go.jp/safety/consultation-for-patients/on-drugs/qa/0025.html)|同じ効果を示す薬でも成分・含量等が異なること|
|[PMDA：一般用医薬品等情報検索](https://www.pmda.go.jp/PmdaSearch/otcSearch/)|製品別の説明書の参照先|
|[厚生労働省：使用上の注意記載要領](https://www.mhlw.go.jp/web/t_doc?dataId=00tc9649&dataType=1&pageNo=1)|併用禁止・使用制限、対象年齢、症状が改善しない場合の相談等は製品ごとに確認すること|
|[消費者庁：健康食品](https://www.caa.go.jp/policies/policy/consumer_safety/food_safety/food_safety_portal/health_food/)|治療の代用としない、薬との相互作用、過剰摂取、健康被害時の中止・受診、利用記録|
|[消費者庁：保健機能食品](https://www.caa.go.jp/policies/policy/food_labeling/foods_with_health_claims)|3制度の違い|
|[消費者庁：機能性表示食品](https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/)|製品ごとの国の審査ではなく事業者の責任による届出制度であること|
|[消費者庁：健康食品の適正使用](https://www.food-safety.caa.go.jp/no.unomi)|薬の代わりにしない、広告・体験談への注意|

## 確認待ち

新規2ページは公的資料と照合した原稿であり、医療者の最終承認は未実施。noindex・公開前の確認用表示を付けた。個別製品の推奨や、全年齢に共通する服用量・使用期間は設定していない。商品・成分別の詳しい相互作用は今後の記事作成時に個別照合する。

GitHubへのコミット・push・デプロイは今回行っていない。

## 追加した5記事

2026年10月21日の拡充分は [EXPANSION_20261021.md](EXPANSION_20261021.md) を参照。新規5記事の原稿は `content/medicine-guide/*.md`、書誌・関連記事は `topics.json`。`node scripts/build-medicine-topics.mjs` でHTMLを再生成できる。`marked` は既存のpackage.jsonの依存関係を利用する。
