/**
 * Excel ファイル(.xlsx)を読み込み、JSON / JSON Lines / CSV で出力する。
 *
 *   node index.js [ファイル] [オプション]
 *
 *   --sheet, -s <番号|名前>   対象シート(番号は0始まり。既定: 0)
 *   --no-header              1行目をヘッダーとして扱わない(列番号をキーにする)
 *   --format, -f <形式>      json(既定) / jsonl / csv
 *   --out, -o <パス>         出力先ファイル(省略時は標準出力)
 *   --list-sheets            シートの一覧を表示して終了
 *   --help, -h               使い方を表示
 *
 * ファイルを省略した場合は、このディレクトリの original.xlsx を読み込む。
 */
const ExcelJs = require("exceljs");
const fs = require("fs");
const path = require("path");
const { parseArgs } = require("util");

/** ファイル省略時に読み込むファイル */
const DEFAULT_TARGET_PATH = path.join(__dirname, "./original.xlsx");

function Excel() {
  let _hasHeaders = false;
  let _worksheets = [];
  let _currentHeaders = [];
  let _currentSheet = null;

  const self = {
    parse: async (path, hasHeaders = false) => {
      if (hasHeaders === true) {
        _hasHeaders = true;
      }
      const workbook = new ExcelJs.Workbook();
      await workbook.xlsx.readFile(path);
      _worksheets = workbook.worksheets;
      return self;
    },
    getSheetNames: () => _worksheets.map((sheet) => sheet.name),
    /** position はシートの位置(0始まり)かシート名 */
    setSheet: (position = 0) => {
      _currentSheet =
        typeof position === "number" ? _worksheets[position] : _worksheets.find((sheet) => sheet.name === position);
      if (!_currentSheet) {
        throw new Error(
          `シート ${JSON.stringify(position)} が存在しません (シート: ${_worksheets.map((s) => s.name).join(", ")})`
        );
      }
      if (_hasHeaders) {
        _currentHeaders = _currentSheet.getRow(1).values;
      }
      return self;
    },
    getHeaders: () => {
      return _currentHeaders;
    },
    addHeader: (value, position) => {
      if (position !== undefined) {
        _currentHeaders[position] = value
      } else {
        _currentHeaders.push(value)
      }
      return self
    },
    getRows: function* () {
      const rowCount = _currentSheet.rowCount;
      let counter = _hasHeaders ? 2 : 1;
      for (counter; counter < rowCount + 1; counter++) {
        const row = _currentSheet.getRow(counter).values;
        if (_hasHeaders) {
          const _obj = {};
          // ExcelJS の values は1始まりで index 0 は常に空のため、空のヘッダーは除外する
          _currentHeaders.forEach((header, index) => {
            if (header === undefined || header === null || header === "") {
              return;
            }
            _obj[header] = row[index];
          });
          yield _obj;
        } else {
          yield { ...row };
        }
      }
    },
  };
  return self;
}

/** ExcelJS のセルの値(数式・リッチテキスト・ハイパーリンク等のオブジェクト)を出力しやすい値に変換する */
const toPlainValue = (value) => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value !== "object") return value;
  if ("result" in value) return toPlainValue(value.result); // 数式
  if (Array.isArray(value.richText)) return value.richText.map((part) => part.text).join(""); // リッチテキスト
  if ("text" in value) return toPlainValue(value.text); // ハイパーリンク
  if ("error" in value) return value.error; // #N/A 等
  return JSON.stringify(value);
};

const toPlainRow = (row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, toPlainValue(value)]));

const escapeCsv = (value) => {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const toCsv = (rows) => {
  // 行ごとにキーが欠けることがあるため、全行のキーを出現順にまとめて列にする
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  return [columns, ...rows.map((row) => columns.map((column) => row[column]))]
    .map((line) => line.map(escapeCsv).join(","))
    .join("\r\n");
};

const USAGE = fs
  .readFileSync(__filename, "utf-8")
  .match(/\/\*\*\n([\s\S]*?)\*\//)[1]
  .replace(/^ \* ?/gm, "");

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      sheet: { type: "string", short: "s", default: "0" },
      "no-header": { type: "boolean", default: false },
      format: { type: "string", short: "f", default: "json" },
      out: { type: "string", short: "o" },
      "list-sheets": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  if (values.help) {
    console.info(USAGE);
    return;
  }
  if (!["json", "jsonl", "csv"].includes(values.format)) {
    throw new Error(`--format は json / jsonl / csv のいずれかを指定してください (${values.format})`);
  }
  const targetPath = positionals[0] ? path.resolve(positionals[0]) : DEFAULT_TARGET_PATH;
  if (!fs.existsSync(targetPath)) {
    throw new Error(`ファイルが見つかりません: ${targetPath}\n使い方は --help を参照`);
  }

  const excel = new Excel();
  await excel.parse(targetPath, !values["no-header"]);
  if (values["list-sheets"]) {
    excel.getSheetNames().forEach((name, index) => console.info(`${index}: ${name}`));
    return;
  }
  excel.setSheet(/^\d+$/.test(values.sheet) ? Number(values.sheet) : values.sheet);

  const rows = [];
  for (const data of excel.getRows()) {
    // 1行ずつ取り出せるので、独自の加工をしたい場合はここで行う
    rows.push(toPlainRow(data));
  }

  const output =
    values.format === "csv"
      ? toCsv(rows)
      : values.format === "jsonl"
        ? rows.map((row) => JSON.stringify(row)).join("\n")
        : JSON.stringify(rows, null, 2);
  if (values.out) {
    // CSV は Excel で開いても文字化けしないよう BOM を付ける
    fs.writeFileSync(values.out, `${values.format === "csv" ? "\uFEFF" : ""}${output}\n`);
    console.error(`${rows.length} 行を ${values.out} に出力しました`);
  } else {
    process.stdout.write(`${output}\n`);
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
