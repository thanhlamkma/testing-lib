/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface IDownExcel {
  headers: any[];
  data: any[];
  fileName: string;
  type: 'tree' | 'plain';
  condition: {
    headers: {
      name: string;
      key: string;
    }[];
    data: { [key: string]: any };
  };
}

export const downExcel = ({
  headers,
  data,
  fileName,
  type = 'plain',
  condition = {
    headers: [],
    data: []
  }
}: IDownExcel) => {
  // console.log('headers', headers);
  // console.log('data', data);
  // console.log('fileName', fileName);
  // console.log('type', type);
  // console.log('condition', condition);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add the first table
  const headerRow1 = 1;
  worksheet.insertRow(
    headerRow1,
    condition.headers.map((item) => item.name)
  );
  worksheet.insertRow(headerRow1 + 1, Object.values(condition.data));

  // Add the second table
  const headerRow2 = 5;
  worksheet.insertRow(
    headerRow2,
    headers.map((item) => item.header)
  );

  let rowNumber = 0;
  const filterKeys = headers.map((item) => item.key);
  function filter(node: any, level: number = 0) {
    const filteredObject: any = {};
    filterKeys.forEach((key) => {
      if (node[key]) {
        filteredObject[key] = node[key];
      } else {
        filteredObject[key] = '';
      }
    });

    filteredObject[filterKeys[0]] = ' '.repeat(level * 6) + node[filterKeys[0]];

    const row = worksheet.insertRow(rowNumber + headerRow2 + 1, Object.values(filteredObject));
    row.outlineLevel = level;

    rowNumber++;

    if (node.children) {
      node.children.forEach((item: any) => filter(item, level + 1));
    }
  }

  if (type === 'tree') {
    data.forEach((row) => {
      filter(row);
    });
  } else {
    //
  }

  // --- CELL & COLUMNS ---
  worksheet.columns.map((column) => (column.width = 26));
  worksheet.eachRow((row, rowNumber) => {
    row.height = 30;

    row.eachCell((cell) => {
      cell.style = {
        font: {
          name: 'Nunito',
          family: 2
        },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        },
        alignment: {
          vertical: 'middle'
        }
      };
    });

    if (rowNumber === 1 || rowNumber === 5) {
      row.height = 36;

      row.eachCell((cell) => {
        cell.style = {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            bgColor: { argb: 'F08080' }
          },
          font: {
            name: 'Nunito',
            family: 2,
            color: { argb: 'FF00FF00' },
            size: 13
          },
          alignment: {
            horizontal: 'center',
            vertical: 'middle'
          }
        };
      });
    }
  });

  // ----- WRITE FILE -----
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(
      new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      `${fileName}-${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
    );
  });

  // Remove the worksheet using worksheet id
  workbook.removeWorksheet(worksheet.id);
};
