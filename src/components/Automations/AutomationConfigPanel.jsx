import React from "react";

/**
 * Componente reutilizável para editar configurações de uma automação.
 * Props:
 * - automation: objeto da automação selecionada (pode ser null)
 * - onSave: função chamada ao salvar alterações
 */
const AutomationConfigPanel = ({ automation, onSave }) => {
  if (!automation) {
    return (
      <div className="bg-gray-700 text-gray-300 rounded-lg p-6 text-center mt-6">
        <span>Nenhuma automação selecionada.</span>
      </div>
    );
  }

  // Exemplo de campos editáveis (ajuste conforme necessidade real)
  return (
    <div className="max-w-2xl mx-auto mt-8 bg-gray-700 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-4">Configurações da Automação</h2>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-semibold">Nome</label>
        <input
          type="text"
          className="w-full rounded px-3 py-2 bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={automation.name}
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-semibold">Status</label>
        <span className={`px-2 py-1 rounded text-xs font-bold ${automation.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {automation.is_active ? 'Rodando' : 'Parado'}
        </span>
      </div>
      {/* Adicione mais campos de configuração aqui */}

      <div className="flex justify-end mt-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition"
          onClick={() => onSave && onSave(automation)}
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default AutomationConfigPanel;
