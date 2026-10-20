window.MIRAI_VACCINE_AGE_DATA={
  "checked": "2026-10-20",
  "fiscalYear": 2026,
  "sourceEdition": "2026-08-01（注釈2026-09-24修正）",
  "scope": "接種可否・必要回数を判定しない対象年齢の案内",
  "vaccines": [
    {
      "id": "hepb",
      "name": "B型肝炎",
      "target": "1歳未満",
      "note": "標準的には生後2か月から予定を立てます。母子感染予防は保険診療の枠組みがあるため、出産した医療機関の指示を確認します。",
      "rule": {
        "minMonth": 0,
        "maxMonth": 12
      },
      "kind": "routine",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "bcg",
      "name": "BCG",
      "target": "1歳未満",
      "note": "標準的な接種時期は生後5か月以上8か月未満です。",
      "rule": {
        "minMonth": 0,
        "maxMonth": 12
      },
      "kind": "routine",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "rota",
      "name": "ロタウイルス",
      "target": "生後6週から。終了期限は製剤によって生後24週または32週まで",
      "note": "月齢だけでは週単位の期限を判定できません。初回は出生14週6日後までを目安に確認し、生年月日と接種歴を接種医に伝えてください。",
      "rule": {
        "minMonth": 1,
        "maxMonth": 8
      },
      "kind": "conditional",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "five",
      "name": "5種混合",
      "target": "生後2か月以上7歳6か月未満",
      "note": "ジフテリア・百日せき・破傷風・ポリオ・Hib感染症を対象とする混合ワクチンです。これまで別の製剤を使っている場合は接種歴に合わせて相談します。",
      "rule": {
        "minMonth": 2,
        "maxMonth": 90
      },
      "kind": "routine",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "pneumo-child",
      "name": "小児の肺炎球菌",
      "target": "生後2か月以上5歳未満",
      "note": "すでに受けた回数と開始した月齢によって、その後の予定が異なります。",
      "rule": {
        "minMonth": 2,
        "maxMonth": 60
      },
      "kind": "routine",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "hib",
      "name": "Hib（単独）",
      "target": "生後2か月以上5歳未満",
      "note": "5種混合に含まれる成分です。5種混合と両方を追加する案内ではありません。単独製剤で開始した場合など、接種歴の確認用です。",
      "rule": {
        "minMonth": 2,
        "maxMonth": 60
      },
      "kind": "history",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "mr1",
      "name": "MR（麻しん・風しん）第1期",
      "target": "1歳以上2歳未満",
      "note": "すでに接種済みなら、年齢だけを理由に追加する必要はありません。",
      "rule": {
        "minMonth": 12,
        "maxMonth": 24
      },
      "kind": "routine",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "varicella",
      "name": "水痘",
      "target": "1歳以上3歳未満",
      "note": "これまでの接種と、病気にかかったことがあるかを確認します。",
      "rule": {
        "minMonth": 12,
        "maxMonth": 36
      },
      "kind": "routine",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "je1",
      "name": "日本脳炎 第1期",
      "target": "生後6か月以上7歳6か月未満",
      "note": "標準的には3歳からの接種が示されています。地域の状況や接種歴を踏まえて接種医と予定を確認します。",
      "rule": {
        "minMonth": 6,
        "maxMonth": 90
      },
      "kind": "routine",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "mr2",
      "name": "MR（麻しん・風しん）第2期",
      "target": "5歳以上7歳未満で、小学校に入る前の1年間",
      "note": "5歳・6歳であることだけでは決まりません。いわゆる年長の年度に当たるか確認してください。",
      "rule": {
        "ages": [
          5,
          6
        ]
      },
      "kind": "conditional",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "je2",
      "name": "日本脳炎 第2期",
      "target": "9歳以上13歳未満",
      "note": "第1期までの接種歴を含めて確認します。",
      "rule": {
        "minAge": 9,
        "maxAge": 13
      },
      "kind": "routine",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "dt",
      "name": "DT（ジフテリア・破傷風）第2期",
      "target": "11歳以上13歳未満",
      "note": "母子健康手帳でこれまでの混合ワクチンの記録を確認します。",
      "rule": {
        "minAge": 11,
        "maxAge": 13
      },
      "kind": "routine",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "hpv",
      "name": "HPV（9価）",
      "target": "小学6年生～高校1年生相当の女子",
      "note": "11歳・16歳では誕生日と学年相当の年度によって対象外の場合があります。男子の任意接種と定期接種は区別します。",
      "rule": {
        "minAge": 11,
        "maxAge": 17
      },
      "kind": "conditional",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "flu",
      "name": "インフルエンザ",
      "target": "65歳以上。または60～64歳で法律上の一定の障害がある方",
      "note": "60～64歳の対象は、一定の心臓・腎臓・呼吸器またはHIVによる免疫機能の障害がある方です。持病があるだけで一律に対象とはなりません。実施時期・費用は自治体へ。",
      "rule": {
        "minAge": 60
      },
      "kind": "adult",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "covid",
      "name": "新型コロナ",
      "target": "65歳以上。または60～64歳で法律上の一定の障害がある方",
      "note": "60～64歳の条件はインフルエンザと同様に、一定の機能障害がある方です。接種歴や自治体の実施期間を確認してください。",
      "rule": {
        "minAge": 60
      },
      "kind": "adult",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "pneumo-adult",
      "name": "高齢者の肺炎球菌",
      "target": "65歳。または60～64歳で法律上の一定の障害がある方",
      "note": "66歳以降すべてが通常の定期接種対象となる仕組みではありません。過去の接種歴を伝えて自治体・医療機関へ確認してください。",
      "rule": {
        "minAge": 60,
        "maxAge": 66
      },
      "kind": "adult",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "shingles",
      "name": "帯状疱疹",
      "target": "2026年度に65・70・75・80・85・90・95・100歳になる方など",
      "note": "現在の満年齢と年度の年齢は異なります。生年月日で対象年度を確認します。60～64歳ではHIVによる一定の免疫機能障害がある方が対象となる場合があります。",
      "rule": {
        "ages": [
          60,
          61,
          62,
          63,
          64,
          65,
          69,
          70,
          74,
          75,
          79,
          80,
          84,
          85,
          89,
          90,
          94,
          95,
          99,
          100
        ]
      },
      "kind": "conditional",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "mr-exception",
      "name": "MRの特例措置",
      "target": "2024年度の第1期・第2期対象者で、供給の偏り等で接種できなかった方",
      "note": "対象の生年月日・未接種の理由・自治体の確認が必要です。2027年3月31日までの措置を確認してください。通常の第1期・第2期とは別枠です。",
      "rule": {
        "ages": [
          3,
          4,
          7,
          8
        ]
      },
      "kind": "exception",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "je-exception",
      "name": "日本脳炎の経過措置",
      "target": "1995年4月2日～2007年4月1日生まれで、20歳未満の未完了の方",
      "note": "年齢だけでは生年月日の条件を確定できません。接種済み回数とあわせて確認します。",
      "rule": {
        "ages": [
          19
        ]
      },
      "kind": "exception",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "rubella-exception",
      "name": "成人男性の風しん特例措置",
      "target": "1962年4月2日～1979年4月1日生まれの男性など、条件に該当する方",
      "note": "2025年3月までの抗体検査結果や未接種の理由などが条件になります。2027年3月31日までの措置の対象か、自治体へ確認してください。",
      "rule": {
        "minAge": 47,
        "maxAge": 65
      },
      "kind": "exception",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    },
    {
      "id": "rsv",
      "name": "RSウイルス（母子免疫）",
      "target": "妊娠28週0日～36週6日の妊婦",
      "note": "年齢ではなく妊娠週数などで対象を確認します。高齢者向けRSウイルスワクチンの任意接種とは別の枠組みです。",
      "rule": {
        "pregnancy": true
      },
      "kind": "conditional",
      "source": "https://id-info.jihs.go.jp/immunization/schedule/2026/20260801_routine-note_r1.pdf"
    }
  ]
};
