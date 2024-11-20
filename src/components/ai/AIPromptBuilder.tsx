import React, { useState } from 'react';
import { Wand2, Save, Sparkle } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import OpenAI from 'openai';

interface AIPromptBuilderProps {
  selectedData: any;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: (content: any) => void;
}

const PROMPT_TEMPLATES = {
  report: [
    {
      name: 'Análisis General',
      template: 'Analiza los datos proporcionados y genera un informe detallado que incluya:\n\n1. Resumen ejecutivo\n2. Principales hallazgos\n3. Tendencias identificadas\n4. Conclusiones y recomendaciones'
    },
    {
      name: 'Comparativa',
      template: 'Realiza un análisis comparativo de los datos, destacando:\n\n1. Similitudes y diferencias\n2. Patrones relevantes\n3. Áreas de mejora\n4. Mejores prácticas identificadas'
    }
  ],
  dashboard: [
    {
      name: 'KPIs',
      template: 'Analiza los datos y sugiere un dashboard con los siguientes elementos:\n\n1. KPIs principales\n2. Gráficos relevantes\n3. Tablas de datos importantes\n4. Filtros recomendados'
    },
    {
      name: 'Tendencias',
      template: 'Diseña un dashboard enfocado en tendencias que incluya:\n\n1. Gráficos de evolución temporal\n2. Indicadores de cambio\n3. Predicciones\n4. Análisis comparativo'
    }
  ]
};

const AIPromptBuilder: React.FC<AIPromptBuilderProps> = ({
  selectedData,
  prompt,
  onPromptChange,
  onGenerate
}) => {
  const { settings } = useSettingsStore();
  const [generating, setGenerating] = useState(false);
  const [outputType, setOutputType] = useState<'report' | 'dashboard'>('report');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    onPromptChange(template);
  };

  const handleGenerate = async () => {
    if (!settings.openaiApiKey) {
      alert('Por favor, configura la API key de OpenAI en la configuración');
      return;
    }

    setGenerating(true);
    try {
      const openai = new OpenAI({
        apiKey: settings.openaiApiKey,
      });

      // Preparar los datos para el prompt
      const formattedData = selectedData.formData.map((item: any) => ({
        formulario: item.form.title,
        campos: item.form.fields.map((f: any) => f.label),
        respuestas: item.responses.length
      }));

      const additionalData = selectedData.additionalFiles.map((file: any) => ({
        archivo: file.name,
        registros: file.data.length,
        campos: Object.keys(file.data[0] || {})
      }));

      const systemPrompt = outputType === 'report' 
        ? 'Eres un experto en análisis de datos y generación de informes. Tu tarea es analizar los datos proporcionados y generar un informe detallado y profesional.'
        : 'Eres un experto en visualización de datos y diseño de dashboards. Tu tarea es analizar los datos y proponer un dashboard efectivo y útil.';

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `
              Instrucciones: ${prompt}

              Datos disponibles:
              
              Formularios:
              ${JSON.stringify(formattedData, null, 2)}

              Archivos adicionales:
              ${JSON.stringify(additionalData, null, 2)}

              ${outputType === 'dashboard' ? 'Genera la especificación del dashboard en formato JSON.' : 'Genera el informe en formato Markdown.'}
            `
          }
        ]
      });

      const content = completion.choices[0].message.content;
      onGenerate({
        type: outputType,
        content,
        data: selectedData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al generar contenido:', error);
      alert('Error al generar el contenido');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de salida
        </label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <button
            onClick={() => setOutputType('report')}
            className={`p-4 text-left border rounded-lg ${
              outputType === 'report'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            <h4 className="font-medium">Informe</h4>
            <p className="text-sm text-gray-500">
              Genera un informe detallado con análisis y conclusiones
            </p>
          </button>
          <button
            onClick={() => setOutputType('dashboard')}
            className={`p-4 text-left border rounded-lg ${
              outputType === 'dashboard'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            <h4 className="font-medium">Dashboard</h4>
            <p className="text-sm text-gray-500">
              Crea visualizaciones y gráficos interactivos
            </p>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Plantillas
        </label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          {PROMPT_TEMPLATES[outputType].map((template, index) => (
            <button
              key={index}
              onClick={() => handleTemplateSelect(template.template)}
              className={`p-4 text-left border rounded-lg ${
                prompt === template.template
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <h4 className="font-medium">{template.name}</h4>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Instrucciones personalizadas
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Modifica las instrucciones según tus necesidades
        </p>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={6}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Sparkle className="animate-spin h-4 w-4 mr-2" />
              Generando...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIPromptBuilder;