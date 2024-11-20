import React, { useState } from 'react';
import { FileText, Plus, Settings, Download } from 'lucide-react';
import { FormResponse } from '../../../types/form';
import { useFormStore } from '../../../stores/formStore';
import { useAuthStore } from '../../../stores/authStore';
import { useNotifications } from '../../notifications/NotificationProvider';
import { useReportStore } from '../../../stores/reportStore';
import DataSourceSelector from './DataSourceSelector';
import DataManipulator from './DataManipulator';
import TemplateSelector from './TemplateSelector';
import PermissionsSelector from './PermissionsSelector';
import { generateReport } from '../../../utils/reportGenerator';

interface ReportGeneratorProps {
  initialResponses: FormResponse[];
  onClose: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ initialResponses, onClose }) => {
  const { forms } = useFormStore();
  const { user } = useAuthStore();
  const { addReport } = useReportStore();
  const { showNotification } = useNotifications();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedData, setSelectedData] = useState<{
    responses: FormResponse[];
    reportType: 'individual' | 'general';
    additionalSources: Array<{
      name: string;
      data: any[];
      headers: string[];
    }>;
    calculatedFields: Record<string, string>;
  }>({
    responses: initialResponses,
    reportType: 'general',
    additionalSources: [],
    calculatedFields: {},
  });

  const [template, setTemplate] = useState<{
    file: Blob;
    fields: string[];
    mappings: Record<string, string>;
  } | null>(null);

  const [permissions, setPermissions] = useState({
    users: [] as string[],
    subnets: [] as string[],
    roles: [] as string[],
  });

  const [selectedFormat, setSelectedFormat] = useState<'docx' | 'pdf' | 'odt'>('docx');

  const steps = [
    {
      title: 'Seleccionar Datos',
      component: (
        <DataSourceSelector
          form={forms.find(f => f.id === initialResponses[0]?.formId)!}
          initialResponses={initialResponses}
          availableForms={forms}
          onDataSelected={setSelectedData}
        />
      )
    },
    {
      title: 'Manipular Datos',
      component: (
        <DataManipulator
          data={selectedData}
          onDataUpdated={setSelectedData}
          onNext={() => setCurrentStep(2)}
        />
      )
    },
    {
      title: 'Seleccionar Plantilla',
      component: (
        <TemplateSelector
          data={selectedData}
          onTemplateSelected={(templateData) => {
            setTemplate({
              file: templateData.file,
              fields: templateData.fields,
              mappings: templateData.mappings
            });
            setCurrentStep(3);
          }}
        />
      )
    },
    {
      title: 'Configurar Permisos',
      component: (
        <PermissionsSelector
          permissions={permissions}
          onPermissionsUpdated={setPermissions}
          onFinish={generateFinalReport}
        />
      )
    }
  ];

  async function generateFinalReport() {
    try {
      if (!template) {
        showNotification('error', 'Debes seleccionar una plantilla');
        return;
      }

      if (!selectedData.responses.length) {
        showNotification('error', 'No hay datos seleccionados para el informe');
        return;
      }

      const reportsToGenerate = selectedData.reportType === 'individual' 
        ? selectedData.responses 
        : [selectedData.responses[0]];

      for (const response of reportsToGenerate) {
        await generateReport({
          response,
          template: template.file,
          fields: template.fields,
          mappings: template.mappings,
          format: selectedFormat
        });
      }

      showNotification('success', 'Informe(s) generado(s) correctamente');
      onClose();
    } catch (error) {
      showNotification('error', 'Error al generar el informe');
    }
  }

  return (
    <div className="relative bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{steps[currentStep].title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        {currentStep === steps.length - 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Formato de salida
            </label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="docx"
                  checked={selectedFormat === 'docx'}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  className="form-radio"
                />
                <span className="ml-2">Word (.docx)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="pdf"
                  checked={selectedFormat === 'pdf'}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  className="form-radio"
                />
                <span className="ml-2">PDF (.pdf)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="odt"
                  checked={selectedFormat === 'odt'}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  className="form-radio"
                />
                <span className="ml-2">OpenDocument (.odt)</span>
              </label>
            </div>
          </div>
        )}

        {steps[currentStep].component}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Anterior
        </button>
        {currentStep < steps.length - 1 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;