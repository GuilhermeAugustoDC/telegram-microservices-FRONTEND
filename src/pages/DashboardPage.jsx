import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/automations/");
        if (!res.ok) throw new Error("Falha ao buscar automações");
        const data = await res.json();

        const total = data.length;
        const active = data.filter((a) => a.is_active).length;
        const inactive = total - active;

        setStats({ total, active, inactive });
        setRecent(data.slice(0, 5)); // últimas 5 automações
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-700 rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold text-white mb-6 text-center">
        Dashboard
      </h1>
      <p className="text-gray-300 text-center mb-10">
        Bem-vindo ao seu painel de automações. Acompanhe abaixo um resumo geral
        e as últimas atividades.
      </p>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">
            Total de Automações
          </h2>
          <p className="text-4xl font-bold text-blue-400">{stats.total}</p>
        </div>

        <div className="bg-gray-800 shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">Ativas</h2>
          <p className="text-4xl font-bold text-green-400">{stats.active}</p>
        </div>

        <div className="bg-gray-800 shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">Inativas</h2>
          <p className="text-4xl font-bold text-red-400">{stats.inactive}</p>
        </div>
      </div>

      {/* Últimas Automações */}
      <div className="bg-gray-800 shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Últimas Automações Criadas
        </h2>
        {recent.length === 0 ? (
          <p className="text-gray-400">Nenhuma automação encontrada.</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {recent.map((auto) => (
              <li
                key={auto.id}
                className="py-3 flex justify-between items-center"
              >
                <span className="text-gray-200 font-medium">{auto.name}</span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    auto.is_active
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {auto.is_active ? "Ativa" : "Inativa"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
