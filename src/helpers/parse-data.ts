import { parse } from 'papaparse';

export interface CsvData {
  date: Date | undefined;
  description: string;
  amount: number;
}

type Data = {
  [key in string]: string;
};

const transformData = (data: Data): CsvData => {
  const amountString = (data.Amount || '').trim();

  let dateString = (data.Date || data['Book date'] || '').trim();
  // This is a SFFCU date in the format of DD-MM-YYYY so change to MM-DD-YYYY
  if (data.hasOwnProperty('Credit/debit indicator')) {
    dateString = dateString.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3');
  }

  return {
    date: dateString ? new Date(dateString) : undefined,
    description: data.Note || data.Description || '',
    amount: parseFloat(amountString) || 0,
  };
};

export const parseData = (file: File): Promise<CsvData[]> => {
  return new Promise((resolve) => {
    parse<Data>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (csv) => {
        resolve(csv.data.map<CsvData>(transformData));
      },
    });
  });
};
