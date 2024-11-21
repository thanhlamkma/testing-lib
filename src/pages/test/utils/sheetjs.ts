import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export type SheetDataType = {
  id: number | string;
  name: string;
  dob: Date;
};

export const downExcelWithSheetJs = (data: SheetDataType[]) => {
  // ----- WORKBOOK -----
  const workbook = new ExcelJS.Workbook();

  // Properties
  workbook.creator = 'Grela';
  workbook.lastModifiedBy = 'Grela';
  workbook.created = new Date(2024, 11, 21);
  workbook.modified = new Date();

  // Force workbook calculation on load
  workbook.calcProperties.fullCalcOnLoad = true;

  // View
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible'
    }
  ];

  // ----- WORKSHEET -----
  const worksheet = workbook.addWorksheet('My Sheet', {
    // With tab color
    properties: {
      tabColor: {
        argb: 'FFC0000'
      }
    },
    // Where the grid lines are hidden and with the first row and column frozen
    views: [{ showGridLines: false, state: 'frozen', xSplit: 1, ySplit: 1 }],
    // With headers and footers
    headerFooter: {
      firstHeader: 'Hello Grela',
      firstFooter: 'Hello World'
    }
  });

  // Access Worksheets
  workbook.eachSheet(function (worksheet: unknown, sheetId: unknown) {
    console.log(worksheet, sheetId);
  });

  // --- TABLES ---
  // add a table to a sheet
  // worksheet.addTable({
  //   name: 'MyTable',
  //   ref: 'A1',
  //   headerRow: true,
  //   totalsRow: true,
  //   style: {
  //     theme: 'TableStyleDark3',
  //     showRowStripes: true
  //   },
  //   columns: [
  //     { name: 'Date', totalsRowLabel: 'Totals:', filterButton: true },
  //     { name: 'Amount', totalsRowFunction: 'sum', filterButton: false }
  //   ],
  //   rows: [
  //     [new Date('2019-07-20'), 70.1],
  //     [new Date('2019-07-21'), 70.6],
  //     [new Date('2019-07-22'), 70.1]
  //   ]
  // });

  // --- COLUMN ---
  // Add column headers and define column keys and widths
  worksheet.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 50 },
    { header: 'D.O.B', key: 'dob', width: 20, style: { numFmt: 'dd/mm/yyyy' } }
  ];

  // Access an individual columns by key, letter and 1-based column number
  const idCol = worksheet.getColumn('id');
  const nameCol = worksheet.getColumn('name');

  console.log(idCol, nameCol);

  // --- ROW ---
  // Get a row object. If it doesn't already exist, a new empty one will be returned
  // const row = worksheet.getRow(5);
  // console.log(row);

  // Get multiple row objects. If it doesn't already exist, new empty ones will be returned
  // const rows = sheet.getRows(5, 2); // start, length (>0, else undefined is returned)

  // Get the last editable row in a worksheet (or undefined if there are none)
  // const row = sheet.lastRow;

  // make row hidden
  // row.hidden = true;

  // assign row values by object, using column keys
  // row.values = {
  //   id: 13,
  //   name: 'Thing 1',
  //   dob: new Date()
  // };

  // Add a couple of Rows by key-value, after the last current row, using the column keys
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // --- CELL ---
  // Cell comment
  // plain text note
  worksheet.getCell('A1').note = 'Hello, ExcelJS!';

  // colourful formatted note
  worksheet.getCell('B1').note = {
    texts: [
      {
        font: { size: 12, color: { theme: 0 }, name: 'Calibri', family: 2, scheme: 'minor' },
        text: 'This is '
      },
      {
        font: { italic: true, size: 12, color: { theme: 0 }, name: 'Calibri', scheme: 'minor' },
        text: 'a'
      },
      {
        font: { size: 12, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' },
        text: ' '
      },
      {
        font: { size: 12, color: { argb: 'FFFF6600' }, name: 'Calibri', scheme: 'minor' },
        text: 'colorful'
      },
      {
        font: { size: 12, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' },
        text: ' text '
      },
      {
        font: { size: 12, color: { argb: 'FFCCFFCC' }, name: 'Calibri', scheme: 'minor' },
        text: 'with'
      },
      {
        font: { size: 12, color: { theme: 1 }, name: 'Calibri', family: 2, scheme: 'minor' },
        text: ' in-cell '
      },
      {
        font: {
          bold: true,
          size: 12,
          color: { theme: 1 },
          name: 'Calibri',
          family: 2,
          scheme: 'minor'
        },
        text: 'format'
      }
    ],
    margins: {
      insetmode: 'custom',
      inset: [0.25, 0.25, 0.35, 0.35]
    },
    protection: {
      locked: 'True',
      lockText: 'False'
    },
    editAs: 'twoCells'
  };

  // --- STYLES & FORMAT ---
  // assign a style to a cell
  // worksheet.getCell('A1').numFmt = '0.00%';

  // Apply styles to worksheet columns
  // worksheet.columns = [
  //   { header: 'Id', key: 'id', width: 10 },
  //   { header: 'Name', key: 'name', width: 50, style: { font: { name: 'Arial Black' } } },
  //   { header: 'D.O.B.', key: 'DOB', width: 10, style: { numFmt: 'dd/mm/yyyy' } }
  // ];

  // ----- WRITE FILE -----
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(
      new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      'test-sheet-js.xlsx'
    );
  });

  // Remove the worksheet using worksheet id
  workbook.removeWorksheet(worksheet.id);
};
