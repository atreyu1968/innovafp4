import React, { useState } from 'react';
import { X, Key, Calendar, Users } from 'lucide-react';
import { useRegistrationStore } from '../../stores/registrationStore';
import { useNotifications } from '../notifications/NotificationProvider';

interface RegistrationCodeModalProps {
  onClose: () => void;
}

const RegistrationCodeModal: React.FC<RegistrationCodeModalProps> = ({ onClose }) => {
  const { generateCode } = useRegistrationStore();
  const { showNotification } = useNotifications();
  const [formData, setFormData] = useState({
    maxUses: 1,
    expiresIn: 24,
  });

  const handleSubmit = () => {
    try {
      const code = generateCode(formData.maxUses, formData.expiresIn);
      showNotification('success', 'Código generado correctamente');
      onClose();
    } catch (error) {
      showNotification('error', (error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center">
            <Key className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">Generar Código de Registro</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número máximo de usos
                </label>
                <div className="mt-2 flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Cuántas veces se puede usar este código
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiempo de validez (horas)
                </label>
                <div className="mt-2 flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="number"
                    min="1"
                    max="720"
                    value={formData.expiresIn}
                    onChange={(e) => setFormData({ ...formData, expiresIn: parseInt(e.target.value) })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Cuánto tiempo estará válido el código
                </p>
              </div>
            </div>

            {/* Right column */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Información Importante
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                  <span className="ml-2">
                    Los códigos son de un solo uso por persona
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                  <span className="ml-2">
                    El código expirará automáticamente después del tiempo establecido
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                  <span className="ml-2">
                    Los usuarios necesitarán este código para completar su registro
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
                  <span className="ml-2">
                    Puedes generar múltiples códigos activos simultáneamente
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Generar Código
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationCodeModal;