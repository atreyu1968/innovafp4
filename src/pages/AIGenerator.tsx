import React, { useState } from 'react';
import { Sparkle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useFormStore } from '../stores/formStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useNotifications } from '../components/notifications/NotificationProvider';
import AIDataSourceSelector from '../components/ai/AIDataSourceSelector';
import AIPromptBuilder from '../components/ai/AIPromptBuilder';
import AIPreview from '../components/ai/AIPreview';

type Step = {
  id: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    id: 'data',
    title: 'Selección de Datos',
    description: 'Elige las fuentes de datos para el análisis'
  },
  {
    id: 'prompt',
    title: 'Instrucciones para la IA',
    description: 'Define qué quieres generar y cómo'
  },
  {
    id: 'preview',
    title: 'Vista Previa y Ajustes',
    description: 'Revisa y ajusta el resultado'
  }
];

const AIGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const { settings } = useSettingsStore();
  const { showNotification } = useNotifications();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'data':
        return (
          <AIDataSourceSelector
            onDataSelected={setSelectedData}
            selectedData={selectedData}
          />
        );
      case 'prompt':
        return (
          <AIPromptBuilder
            selectedData={selectedData}
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={setGeneratedContent}
          />
        );
      case 'preview':
        return (
          <AIPreview
            content={generatedContent}
            onSave={() => {
              showNotification('success', 'Contenido guardado correctamente');
              // Implement save logic
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generador por IA</h2>
          <p className="mt-1 text-sm text-gray-500">
            Crea informes y dashboards automáticamente con IA
          </p>
        </div>
        <Sparkle className="h-8 w-8 text-blue-500" />
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {steps.map((step, index) => (
              <button
                key={step.id}
                className={`w-1/3 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  index === currentStep
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setCurrentStep(index)}
                disabled={index > currentStep && !generatedContent}
              >
                <span className="block text-xs text-gray-400 mb-1">
                  Paso {index + 1}
                </span>
                {step.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6">
            {steps[currentStep].description}
          </p>

          {renderStep()}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1 || !selectedData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;