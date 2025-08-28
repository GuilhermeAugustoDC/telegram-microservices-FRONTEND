import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AutomationList from "../components/Automations/AutomationList";
import AutomationConfigPanel from "../components/Automations/AutomationConfigPanel";

const AutomationsPage = () => {
  const [automations, setAutomations] = useState([]);
  const [selectedAutomation, setSelectedAutomation] = useState(null);

  const fetchAutomations = async () => {
    try {
      const response = await fetch("/api/automations/");
      if (!response.ok) throw new Error("Falha ao buscar automações");
      const data = await response.json();
      setAutomations(data);
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  const handleToggleAutomation = async (id, isRunning) => {
    const action = isRunning ? "stop" : "start";
    try {
      const response = await fetch(`/api/automations/${id}/${action}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error(`Falha ao ${action} a automação`);
      fetchAutomations();
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    }
  };

  const handleDeleteAutomation = async (id) => {
    if (!window.confirm("Deseja realmente remover esta automação?")) return;
    try {
      const response = await fetch(`/api/automations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Falha ao remover a automação");
      fetchAutomations();
      alert("Automação removida com sucesso!");
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    }
  };

  const handleSaveAutomation = async (automation) => {
    try {
      const response = await fetch(`/api/automations/${automation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(automation),
      });
      if (!response.ok) throw new Error("Falha ao salvar a automação");
      fetchAutomations();
      alert("Automação salva com sucesso!");
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-700 p-5 rounded-lg">
      <h1 className="text-3xl text-center font-extrabold text-white mb-6 ">
        Gerenciar Automações
      </h1>
      <div className="mt-8 mb-2 text-center space-y-4">
        <Link
          to="/listchannels"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm"
        >
          Criar Automação
        </Link>
        <AutomationList
          automations={automations}
          onToggleAutomation={handleToggleAutomation}
          onDeleteAutomation={handleDeleteAutomation}
          onSelectAutomation={setSelectedAutomation}
        />
      </div>
      <AutomationConfigPanel
        automation={selectedAutomation}
        onSave={handleSaveAutomation}
      />
    </div>
  );
};

export default AutomationsPage;
