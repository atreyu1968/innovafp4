import React from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { useFormStore } from '../../stores/formStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useReportStore } from '../../stores/reportStore';

interface AIPreviewProps {
  content: any;
  onSave: () => void;
}

const AIPreview: React.FC<AIPreviewProps> = ({ content, onSave }) => {
  if (!content) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Vista Previa
        </h3>

        <div className="prose max-w-none">
          {content.type === 'report' ? (
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          ) : (
            <div>
              {/* Dashboard preview would go here */}
              <p className="text-gray-500">Vista previa del dashboard</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            // Implement regenerate logic
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerar
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </button>
      </div>
    </div>
  );
};

export default AIPreview;