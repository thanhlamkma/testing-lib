/* eslint-disable @typescript-eslint/no-explicit-any */
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export enum TableDataType {
  TREE = 1,
  PLAIN = 2
}

function flattenTree(data: unknown[], depth = 0, result: unknown[] = []) {
  data.forEach((item: any) => {
    const row = {
      Level: depth,
      Name: item.name,
      // Add other properties as needed, e.g., price, description
      ...(item.price && { Price: item.price }),
      ...(item.description && { Description: item.description })
    };
    result.push(row);
    if (item.children) {
      flattenTree(item.children, depth + 1, result);
    }
  });
  return result;
}

export function downloadExcel(
  condition: { [key: string]: unknown },
  header: string[],
  data: unknown[],
  type: TableDataType
) {
  console.log(condition, header, type);

  // ? Why have both condition and data in param ???
  // => Should have only data
  if (condition) {
    // Call API with condition request to return data for downloading
  }

  if (!data || data.length === 0) {
    console.error('Error: Data is empty');
    return;
  }

  // Flatten the tree-like data
  const tempData = type === TableDataType.TREE ? flattenTree(data) : data;

  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tempData, { header });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    // workbook.Sheets['Sheet1'] = worksheet;
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, 'export.xlsx');
  } catch (error) {
    console.log(error);
  }
}
