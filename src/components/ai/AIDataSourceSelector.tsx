import React, { useState, useRef } from 'react';
import { Upload, FileText, Database, X } from 'lucide-react';
import { useFormStore } from '../../stores/formStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useNotifications } from '../notifications/NotificationProvider';
import * as XLSX from 'xlsx';

interface AIDataSourceSelectorProps {
  selectedData: any;
  onDataSelected: (data: any) => void;
}

const AIDataSourceSelector: React.FC<AIDataSourceSelectorProps> = ({
  selectedData,
  onDataSelected
}) => {
  const { forms, getResponsesByForm } = useFormStore();
  const { activeYear } = useAcademicYearStore();
  const { showNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedForms, setSelectedForms] = useState<string[]>(selectedData?.formIds || []);
  const [additionalFiles, setAdditionalFiles] = useState<{
    name: string;
    type: string;
    data: any[];
  }[]>([]);

  const activeForms = forms.filter(form => 
    form.academicYearId === activeYear?.id
  );

  const handleFormToggle = (formId: string) => {
    const newSelection = selectedForms.includes(formId)
      ? selectedForms.filter(id => id !== formId)
      : [...selectedForms, formId];
    
    setSelectedForms(newSelection);
    updateSelectedData(newSelection, additionalFiles);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      try {
        const data = await processFile(file);
        if (data) {
          setAdditionalFiles(prev => [...prev, {
            name: file.name,
            type: file.type,
            data
          }]);
          updateSelectedData(selectedForms, [...additionalFiles, {
            name: file.name,
            type: file.type,
            data
          }]);
        }
      } catch (error) {
        showNotification('error', `Error al procesar ${file.name}`);
      }
    }
  };

  const processFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          if (file.type === 'application/json') {
            const data = JSON.parse(e.target?.result as string);
            resolve(Array.isArray(data) ? data : [data]);
          } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel' ||
            file.type === 'text/csv'
          ) {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            resolve(jsonData);
          } else {
            reject(new Error('Formato de archivo no soportado'));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));

      if (file.type === 'application/json' || file.type === 'text/csv') {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const removeFile = (index: number) => {
    setAdditionalFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      updateSelectedData(selectedForms, newFiles);
      return newFiles;
    });
  };

  const updateSelectedData = (forms: string[], files: typeof additionalFiles) => {
    const selectedFormData = forms.map(id => ({
      form: activeForms.find(f => f.id === id),
      responses: getResponsesByForm(id)
    }));

    onDataSelected({
      formIds: forms,
      formData: selectedFormData,
      additionalFiles: files
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-500" />
            Formularios
          </h3>
          <div className="mt-4 space-y-4">
            {activeForms.map(form => (
              <div
                key={form.id}
                className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                  selectedForms.includes(form.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => handleFormToggle(form.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {form.title}
                    </h4>
                    {form.description && (
                      <p className="mt-1 text-xs text-gray-500">
                        {form.description}
                      </p>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedForms.includes(form.id)}
                    onChange={() => handleFormToggle(form.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {getResponsesByForm(form.id).length} respuestas
                </div>
              </div>
            ))}
            {activeForms.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No hay formularios disponibles
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Archivos Adicionales
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Archivo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".json,.csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="mt-4 space-y-4">
            {additionalFiles.map((file, index) => (
              <div key={index} className="relative bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.data.length} registros
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {additionalFiles.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No hay archivos adicionales
              </p>
            )}
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Formatos soportados:
            </h4>
            <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
              <li>JSON (.json)</li>
              <li>CSV (.csv)</li>
              <li>Excel (.xlsx, .xls)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDataSourceSelector;