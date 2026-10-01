import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createXlsxWorkbook } from "./xlsx.ts";

describe("createXlsxWorkbook", () => {
  it("creates a workbook with the supplied headers and registration data", () => {
    const workbook = createXlsxWorkbook(
      ["Name", "T-shirt size"],
      [["Test Delegate", "M"]],
    );

    assert.deepEqual(Array.from(workbook.slice(0, 4)), [0x50, 0x4b, 0x03, 0x04]);
    const workbookText = new TextDecoder().decode(workbook);
    assert.match(workbookText, /T-shirt size/);
    assert.match(workbookText, /Test Delegate/);
    assert.match(workbookText, />M</);
  });
});