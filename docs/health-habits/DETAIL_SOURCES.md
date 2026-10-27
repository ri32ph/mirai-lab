# 飲み合わせ：詳しいページの照合記録

2026年10月22日確認。Bの既存5記事を「基本編」と表示し、詳細入口と5記事を追加。公開・コミット・pushは行っていません。

## ページ一覧

| ページ | URL（content/health-habits/以下） |
|---|---|
| 詳しいページの入口 | food-interactions-details.html |
| イソニアジドと飲食物 | isoniazid-food.html |
| グレープフルーツと薬 | grapefruit-medicines.html |
| ワルファリンと食品 | warfarin-food.html |
| 乳製品・ミネラルと薬 | minerals-medicines.html |
| お酒と薬 | alcohol-medicines.html |

原稿は同名のMarkdownに保存。入口は共通ビルダーで生成。既存URLを維持。

## 医学的な判断と根拠

- イソニアジド：PMDA電子添文の10.2を直接確認。ヒスチジン含有魚とヒスタミン中毒、チラミン含有食品と血圧上昇・動悸を区別。ヒスタミン代謝とチラミンのMAOによる代謝を同一の仕組みとして説明しない。含有量や発症確率の数値は示さない。
- 食品保存：消費者庁資料でヒスチジンからのヒスタミン生成、冷蔵、加熱で除けないことを確認。「新鮮なら服薬中でも安全」とは説明しない。
- グレープフルーツ：タクロリムスを先に取り上げ、国内電子添文で血中濃度上昇・腎障害・不整脈等を確認。降圧薬より一律に何倍危険という比較はしていない。摂取後の症状だけで安全と判断させず、速やかな連絡を案内。
- ワルファリン：PMDAの一般向けQ&Aと厚生労働省掲載Q4-5で、納豆・青汁・クロレラ、時間をずらしても解決しないこと、他の抗血栓薬へ一般化しないことを確認。
- ミネラル：シプロキサン錠のメーカー公式電子添文（2026年9月改訂）10.2を確認。金属含有製剤について「本剤服用後2時間以上」と、空腹時のカルシウム含有飲料同時服用の注意を区別。全薬剤・乳製品に同じ間隔を当てはめない。
- アレンドロン酸：5mg「YD」の2026年4月患者向ガイドと電子添文で、水180mL、少なくとも30分、最初の食事を終えるまで横にならない等を確認。ほかの薬・剤形に流用しない。
- 飲酒：メトロニダゾール国内電子添文の「投与期間中は飲酒を避ける」を確認。薬の仕組みを一律に説明しない。治療終了後の共通の禁酒日数は提示しない。
- 睡眠薬と飲酒：国内睡眠学会資料とNHSのゾピクロン情報を参照。古い国内資料を現行薬全体の比較として使用しない。英国の投与量や期間、救急番号は流用しない。

## 主な資料

1. [PMDA：イスコチン電子添文](https://www.pmda.go.jp/PmdaSearch/iyakuDetail/530258_6222001F3037_3_03)
2. [消費者庁：ヒスタミン食中毒](https://www.caa.go.jp/policies/policy/consumer_safety/food_safety/food_safety_portal/other/contents_001/)
3. [PMDA：プログラフカプセル5mg電子添文](https://www.pmda.go.jp/PmdaSearch/iyakuDetail/ResultDataSetPDF/800126_3999014M3025_3_35)
4. [愛知医科大学病院：食品との相互作用](https://www.aichi-med-u.ac.jp/hospital/sh10/sh1008/sh100801/sh100801_06.html)
5. [大阪市立総合医療センター：薬と食の相互作用](https://www.osakacity-hp.or.jp/ocgh/kaisetsu/7419.html)
6. [PMDA：ワルファリンと食品](https://www.pmda.go.jp/safety/consultation-for-patients/on-drugs/qa/0016.html)
7. [厚生労働省掲載資料：Q4-5 食事との相互作用](https://www.mhlw.go.jp/content/001409754.pdf)
8. [バイエル：シプロキサン錠電子添文](https://pharma-navi.bayer.jp/PDF/CIP_TAB_MPI)
9. [PMDA：アレンドロン酸5mg「YD」患者向ガイド](https://www.info.pmda.go.jp/downfiles/guide/ph/830001_3999018F1137_1_07G.pdf)
10. [PMDA：アレンドロン酸5mg「YD」電子添文](https://www.pmda.go.jp/PmdaSearch/iyakuDetail/ResultDataSetPDF/830001_3999018F1137_1_10)
11. [PMDA：フラジール内服錠電子添文](https://www.pmda.go.jp/PmdaSearch/iyakuDetail/ResultDataSetPDF/343018_6419002F1131_2_06)
12. [日本睡眠学会等：睡眠薬の適正使用ガイドライン](https://www.jssr.jp/files/guideline/suiminyaku-guideline.pdf)
13. [NHS：ゾピクロン](https://www.nhs.uk/medicines/zopiclone/)
14. [NHS：Alcohol-use disorder](https://www.nhs.uk/conditions/alcohol-use-disorder/)

## 公開前に医療者が確認する点・範囲の限界

- イソニアジド使用中の食品選択を、どこまで具体的に案内するか。全食品共通の安全量は確認できておらず、数値を推測していない。
- 製品ごとの服用条件と緊急度を最終確認。対象薬の網羅的リストではない。
- 稀な相互作用の発生率、薬同士の相対的な危険度、全柑橘類の適否は定量的・網羅的に評価していない。
- 禁酒終了時期の一律の数字は示さず、製品と処方元への確認を案内。
- 個別の減薬・休薬の指示を一般記事から自動的に導かせない。

日本語は既存記事の語調に合わせて手動で校正。既知の環境制約（sudachipy未導入）により日本語lintは利用せず、見出し・拾い読み・文の長さ・原因の自己判断を促さない表現を確認。

## 参考文献の再評価（同日追記）

上記は初回の照合記録。公開原稿のグレープフルーツでは愛知医科大学・大阪市立総合医療センターの解説を主要参考文献から外し、HFNetの引用付き解説、日本医療薬学会ガイド、原著の前向き研究を採用しました。イソニアジド・ワルファリン・乳製品には原著の研究条件と限界を追記。最新の採用・確認状態は `REFERENCE_AUDIT_20261022.md` を参照してください。
