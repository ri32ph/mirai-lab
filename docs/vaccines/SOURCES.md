# 予防接種・ワクチン 初回制作の資料確認

確認日：2026-10-20。サイトの医学的最終承認ではない。

- [faq](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/kihonteki_keikaku/index_00001.html)

- [portal](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/index.html)

- [schedule](https://id-info.jihs.go.jp/immunization/schedule/currently/index.html)

- [interval](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou03/rota_index_00003.html)

## 照合した範囲

- 厚生労働省「よくある質問」Q1～4・Q6～8：役割、定期／任意、対象期間、当日の体調、接種後の待機と相談、副反応。個別製剤の添付文書は未照合。
- 厚生労働省「接種間隔」：異なるワクチンに一律の間隔を当てはめないこと。今回、間隔日数や個別の同時接種可否の一覧は掲載していない。
- 国立健康危機管理研究機構の最新版ページ：2026年9月24日更新、2026年8月1日版のスケジュール、全年齢・0～20歳未満・20歳以上・注釈への入口があることを確認。リンク先PDFの全表を逐条確認したものではない。サイトへ表を転載していない。
- 厚生労働省の総合入口：各ワクチン・制度へのリンク案内。

## 未確認・公開前に必要なこと

医療者による全新規文章の確認。特定ワクチンの記事を追加する際は対象者・年齢・間隔・回数・費用・禁忌・注意事項を現行資料と個別照合する。自治体ごとの助成、渡航ワクチン、妊娠中や免疫抑制状態での個別接種判断は今回掲載していない。

日本小児科学会のスケジュール案内は検索で見つかったが本文取得に失敗したため、照合済み資料には含めていない。


## 年齢選択機能の追加照合（2026-10-20）

[国立健康危機管理研究機構｜定期接種スケジュール・注釈（2026年8月1日版、9月24日注釈修正）](https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf)の対象者欄と注釈を取得し、年齢検索に使う範囲を確認。図表自体は転載していない。

- PDF 2頁：B型肝炎、ロタの週単位の開始・終了と初回目安
- 3頁：小児肺炎球菌、5種混合・単独Hib、以前の製剤からの継続の注意
- 4頁：DT、BCG、MR・特例、水痘、日本脳炎・経過措置
- 5頁：HPVの学年相当年度・女子・9価
- 6頁：RSウイルスの母子免疫、インフルエンザ、新型コロナ
- 7頁：成人肺炎球菌、帯状疱疹の年度年齢・経過措置

単なる満年齢で対象確定できないものは条件確認に分類。ロタは月齢では週齢を確定できないため必ず条件表示。MR第2期・HPV・帯状疱疹は学年／年度を推測しない。60～64歳の一定の障害は自己診断させず自治体での確認を案内。Hib単独は5種混合に追加する意味ではないと明記。特例の表示は基準日現在の年齢候補であり、生年月日・接種歴等の確認が必要。

自治体ごとの認定・助成、長期療養等の全特例、任意接種の一覧、必要回数・接種可否・接種間隔の個別判定は対象外。2027年度になると更新確認まで年齢選択を停止する。

データの医療者最終承認は未了。資料の製剤別全記載を完全に点検したものではなく、機能に使う対象条件を確認した記録。

## 2026年10月21日：対象期間の強調表示

- [厚生労働省｜高齢者の肺炎球菌ワクチン](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/vaccine/pneumococcus-senior/index.html)：定期接種対象は65歳、60〜64歳は一定の障害のある方。2026年度はPCV20を使用。長期療養特例は個別確認が必要。通常の対象期間として65歳の間を強調し、生涯で接種できる機会が一度だけという表現にはしていない。
- [厚生労働省｜MRワクチン](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/vaccine/mr/index.html)：第1期の通常対象は1歳以上2歳未満。対象年齢外の相談・特例の可能性も否定しない。

強調対象はまず肺炎球菌65歳とMR第1期の2例。年度・生年月日・週齢による条件がある接種を、年齢だけで同じ表示に追加していない。未強調の接種に期限がないという意味ではない。age-data.jsonのattentionに対象年齢・文言を管理。元の対象候補判定は維持。
