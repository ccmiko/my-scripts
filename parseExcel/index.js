const ExcelJs = require("exceljs");
const path = require("path");

/** 対象ファイルの名称 */
const TARGET_PATH = path.join(__dirname, "./original.xlsx");
/** 対象のシート名 */
const TARGET_SHEET_POSITION = 0;
/** 1行目がヘッダー行のデータか？ */
const HAS_HEADER = true;

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
    setSheet: (position = 0) => {
      _currentSheet = _worksheets[position];
      if (_hasHeaders) {
        _currentHeaders = _currentSheet.getRow(1).values;
      }
      return self;
    },
    getHeaders: () => {
      return _currentHeaders;
    },
    getRows: function* () {
      const rowCount = _currentSheet.rowCount;
      let counter = _hasHeaders ? 2 : 1;
      for (counter; counter < rowCount + 1; counter++) {
        const row = _currentSheet.getRow(counter).values;
        if (_hasHeaders) {
          const _obj = {}
          _currentHeaders.forEach((header, index)=> {
            _obj[header] = row[index]
          })
          yield _obj
        } else {
          yield {...row}
        }
      }
    },
  };
  return self;
}

async function main() {
  const excel = new Excel();
  (await excel.parse(TARGET_PATH, HAS_HEADER)).setSheet(TARGET_SHEET_POSITION);
  for await (const data of excel.getRows()) {
    // dataの中に1行1行取れるので好きに加工する
    console.info(data)
  }
}

main();
