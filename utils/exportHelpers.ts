import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data: any[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Projects');
  const csvOutput = XLSX.write(wb, { bookType: 'csv', type: 'array' });
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
};

export const exportToExcel = (data: any[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Projects');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], fileName: string) => {
  const doc = new jsPDF();
  const tableData = data.map(p => [
    p.group_number,
    p.project_title,
    p.domain,
    p.category,
    p.university,
    p.institute_name,
    p.participants?.map((x: any) => x.name).join(', ') || '-',
    p.status,
    p.totalmarks ?? '-',
  ]);

  autoTable(doc, {
    head: [[
      'Group No.', 'Title', 'Domain', 'Category', 'University',
      'Institute', 'Participants', 'Status', 'Total Marks',
    ]],
    body: tableData,
  });

  doc.save(`${fileName}.pdf`);
};
