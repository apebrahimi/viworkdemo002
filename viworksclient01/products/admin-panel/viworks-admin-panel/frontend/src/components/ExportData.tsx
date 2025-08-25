import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

interface ExportDataProps {
  onExport: (format: string, data: any) => void;
  data: any[];
  filename?: string;
}

export const ExportData: React.FC<ExportDataProps> = ({
  onExport,
  data,
  filename = 'export'
}) => {
  const [format, setFormat] = useState('csv');
  const [loading, setLoading] = useState(false);

  const formatOptions = [
    { value: 'csv', label: 'CSV' },
    { value: 'json', label: 'JSON' },
    { value: 'txt', label: 'Text' }
  ];

  const handleExport = async () => {
    setLoading(true);
    try {
      await onExport(format, data);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[]) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');
    
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = (data: any[]) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const exportToTXT = (data: any[]) => {
    const txtContent = data.map(row => 
      Object.entries(row).map(([key, value]) => `${key}: ${value}`).join('\n')
    ).join('\n\n');
    
    downloadFile(txtContent, `${filename}.txt`, 'text/plain');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFormatExport = () => {
    switch (format) {
      case 'csv':
        exportToCSV(data);
        break;
      case 'json':
        exportToJSON(data);
        break;
      case 'txt':
        exportToTXT(data);
        break;
      default:
        onExport(format, data);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Export Format
        </label>
        <Select
          options={formatOptions}
          value={format}
          onChange={setFormat}
          placeholder="Select export format"
        />
      </div>
      <Button
        onClick={handleFormatExport}
        disabled={loading || data.length === 0}
        variant="outline"
        size="sm"
      >
        {loading ? 'Exporting...' : 'Export'}
      </Button>
    </div>
  );
};
