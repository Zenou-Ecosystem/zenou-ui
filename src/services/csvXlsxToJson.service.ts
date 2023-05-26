import {read, utils} from "xlsx";

export class CsvXlsxToJsonService {
    /**
     * Converts a CSV string to a JSON array.
     * @param {string} data - The CSV data to convert.
     * @returns {Array} - An array of objects representing the rows in the CSV data.
     */
    convertCSVToJSON(data: string) {
        const lines = data.split("\n");
        const headers = lines[0].split(",");
        const rows = lines.slice(1);

        return rows.map((row) => {
            const data = row.split(",");
            return {
                ...headers.reduce((acc, header, index) => ({
                    ...acc,
                    [header.toLowerCase().replaceAll(' ', '_')]: data[index],
                }), {}),
            };
        });
    }

    /**
     * Converts an Excel file to a JSON array.
     * @param {string} data - The binary data of the Excel file.
     * @returns {Array} - An array of objects representing the rows in the Excel file.
     */
    convertExcelToJSON(data: string) {
        // Read the workbook from the binary data
        const workbook: any = read(data, {type: 'binary'});

        // Get the first sheet from the workbook
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Get the range of cells in the sheet
        const range = utils.decode_range(sheet['!ref']);

        // Get the headers for the sheet
        const headers = Array.from({ length: range.e.c + 1 - range.s.c }, (_, i) => {
            const headerCell = sheet[utils.encode_cell({r: range.s.r, c: range.s.c + i})];
            if(headerCell?.v){
                return headerCell?.v;
            }
        });

        // Map each row in the sheet to an object with header keys and cell values
        return Array.from({length: range.e.r - range.s.r}, (_, i) => {
            return Array.from({length: headers.length}, (_, j) => {
                const cell = sheet[utils.encode_cell({r: range.s.r + i + 1, c: range.s.c + j})];
                return cell ? cell.v : '';
            }).reduce((obj, value, index) => {
                if(headers[index]){
                    // Sanitize header keys by converting to lowercase, trimming whitespace, and replacing special characters with underscores
                    const headerKey = headers[index].toLowerCase().trim().replace(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/gi, '_');
                    obj[headerKey] = value;
                }
                return obj;
            }, {});
        });
    }
}
