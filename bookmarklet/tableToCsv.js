// @title 表をCSVで保存
// @description ページ内の表(table)を CSV ファイルとして保存する
// @include toast

/**
 * ページ内の <table> を CSV ファイルとしてダウンロードする。
 * 表が複数ある場合は、各表に番号を表示してどれを保存するか選んでもらう。
 * rowspan / colspan は同じ値で埋めて、Excel で開いても列がずれないようにする。
 */
function main() {
  const tables = [...document.querySelectorAll("table")].filter((table) => table.rows.length > 0);
  if (tables.length === 0) {
    showToast("このページに表(table)が見つかりませんでした");
    return;
  }

  const escapeCsv = (value) => {
    const text = value.replace(/\s+/g, " ").trim();
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  /** rowspan / colspan を展開した2次元配列にする */
  const toMatrix = (table) => {
    const matrix = [];
    [...table.rows].forEach((row, rowIndex) => {
      matrix[rowIndex] ??= [];
      let colIndex = 0;
      [...row.cells].forEach((cell) => {
        while (matrix[rowIndex][colIndex] !== undefined) colIndex++;
        const text = cell.innerText ?? cell.textContent ?? "";
        const rowSpan = Math.max(1, cell.rowSpan || 1);
        const colSpan = Math.max(1, cell.colSpan || 1);
        for (let r = 0; r < rowSpan; r++) {
          matrix[rowIndex + r] ??= [];
          for (let c = 0; c < colSpan; c++) matrix[rowIndex + r][colIndex + c] = text;
        }
        colIndex += colSpan;
      });
    });
    return matrix;
  };

  const download = (table, index) => {
    const csv = toMatrix(table)
      .map((row) => Array.from(row, (value) => escapeCsv(value ?? "")).join(","))
      .join("\r\n");
    // Excel で文字化けしないよう BOM を付ける
    const blob = new Blob(["﻿", csv], { type: "text/csv" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    const title = (document.title || "table").replace(/[\\/:*?"<>|]/g, "_").slice(0, 50);
    anchor.download = `${title}_${index + 1}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
    showToast(`表${index + 1}を CSV で保存しました`);
  };

  if (tables.length === 1) {
    download(tables[0], 0);
    return;
  }

  // 各表に番号ラベルと枠線を付けて選んでもらう
  const markers = tables.map((table, index) => {
    const rect = table.getBoundingClientRect();
    const label = document.createElement("div");
    label.textContent = `表${index + 1}`;
    label.style.cssText =
      `position: absolute; top: ${rect.top + window.scrollY}px; left: ${rect.left + window.scrollX}px; ` +
      "z-index: 2147483647; padding: 2px 6px; background: #e8590c; color: #fff; font: bold 14px sans-serif;";
    document.body.appendChild(label);
    const originalOutline = table.style.outline;
    table.style.outline = "3px solid #e8590c";
    return () => {
      label.remove();
      table.style.outline = originalOutline;
    };
  });
  // ラベルを描画してから prompt を出す
  setTimeout(() => {
    const answer = window.prompt(
      `表が${tables.length}個あります。保存する表の番号を入力してください(1〜${tables.length})`,
      "1",
    );
    markers.forEach((clear) => clear());
    if (answer === null) return;
    const index = Number(answer) - 1;
    if (!Number.isInteger(index) || !tables[index]) {
      showToast("番号が正しくありません");
      return;
    }
    download(tables[index], index);
  }, 50);
}
main();
