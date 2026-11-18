/**
 * ミニアプリの一覧(ここが唯一の定義元)。
 * 一覧ページ(index.html)と Service Worker(sw.js)が実行時に読み込み、
 * manifest.webmanifest のショートカットは `node scripts/sync-apps.js` で生成する。
 *
 * - file: htmls/ 内のファイル名
 * - shortcut: true にするとホーム画面アイコンの長押しメニュー(ショートカット)に出す
 * - localOnly: true にすると GitHub Pages の公開版には含めない(scripts/build-pages.js)。relatedFiles も一緒に除く
 *
 * アプリを追加したらここに1行足すだけでよい。
 */
globalThis.MINI_APPS = [
  {
    file: "account.html",
    icon: "🔑",
    title: "アカウント一覧",
    description: "ID/PWをワンクリックでコピー(マスターパスワードで暗号化)",
    localOnly: true,
    relatedFiles: ["account.sample.json"],
  },
  { file: "style_slayer.html", icon: "🧹", title: "書式殺し", description: "貼り付けたテキストの書式を削除" },
  {
    file: "char_counter.html",
    icon: "🔢",
    title: "文字数カウンタ",
    description: "文字数・全角半角・バイト数・原稿用紙換算など",
  },
  {
    file: "medicine_management.html",
    icon: "💊",
    title: "服薬記録帳",
    description: "おくすりを飲んだ時刻を記録し、履歴をCSVで保存",
    shortcut: true,
  },
  {
    file: "fire_keeper.html",
    icon: "🔥",
    title: "火継",
    description: "指定時間、画面のスリープを防止",
    shortcut: true,
  },
  {
    file: "pomodoro.html",
    icon: "🍅",
    title: "ポモドーロ",
    description: "作業と休憩を交互に計るタイマー(スリープ防止付き)",
    shortcut: true,
  },
  {
    file: "ocr.html",
    icon: "🔍",
    title: "画像から文字起こし隊",
    description: "画像内の文字をOCRで抽出(貼り付けにも対応)",
  },
  {
    file: "qr_reader_image.html",
    icon: "🖼️",
    title: "QRコードリーダ(静止画版)",
    description: "画像ファイルからQRコードを読み取り",
  },
  {
    file: "qr_reader_camera.html",
    icon: "📷",
    title: "QRコードリーダ(カメラ版)",
    description: "カメラでQRコードを読み取り",
    shortcut: true,
  },
  { file: "mic.html", icon: "🎙️", title: "遅延再生くん", description: "マイク入力を遅延させて再生" },
  {
    file: "qr_generator.html",
    icon: "🔳",
    title: "QRコード生成",
    description: "テキスト・URL・Wi-Fi設定からQRコードを作成",
  },
  {
    file: "exif_cleaner.html",
    icon: "📍",
    title: "写真の位置情報消し",
    description: "位置情報などのメタデータを削除し、縮小・圧縮して保存",
  },
  {
    file: "date_calc.html",
    icon: "📅",
    title: "和暦・日付計算",
    description: "西暦⇔和暦、○日後、日付の差、年齢",
  },
  {
    file: "dev_tools.html",
    icon: "🛠️",
    title: "開発用変換ツール",
    description: "JSON整形・Base64・URLエンコード・JWT・ハッシュ・UUIDなど",
  },
];
