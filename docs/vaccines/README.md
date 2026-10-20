# 予防接種・ワクチン（確認用）

2026-10-20。content/vaccines/index.html が全年齢の入口。子ども向け2記事と年齢選択を含む。全ページにnoindexと医療者確認待ち表示。

- 原稿：content/vaccines/children.md / visit.md
- 入口・共通テンプレート：scripts/build-vaccines.mjs
- 年齢検索の配置：content/vaccines/age-picker-section.html
- 対象条件：content/vaccines/age-data.json（2026年度版）
- 生成データ：age-data.js。JSON更新後にビルドする。
- 再生成：npm install後、node scripts/build-vaccines.mjs
- 年齢ロジック検査：node scripts/check-vaccine-age.cjs

年齢だけで接種可否を判定しない。学年・年度・接種歴・基礎疾患等の条件は結果内にも表示。2027年度に年齢検索を停止する。医学的最終承認・実機確認は未了。資料の照合範囲はSOURCES.md。

トップには、年代・対象別の5入口と別に「薬・予防接種を調べる」の2メニューを配置。まちの健康・医療案内（諫早市）は別サイトのバナーとして表示し、自治体の公式運営や提携を示す文言は使用していない。
