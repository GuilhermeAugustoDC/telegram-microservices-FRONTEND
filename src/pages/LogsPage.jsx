import React, { useEffect, useMemo, useState } from 'react';

function LevelBadge({ level }) {
	const color = useMemo(() => {
		switch ((level || '').toUpperCase()) {
			case 'ERROR':
				return 'bg-red-600/20 text-red-400 border-red-500/40';
			case 'WARNING':
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/40';
			case 'DEBUG':
				return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
			default:
				return 'bg-green-600/20 text-green-400 border-green-500/40'; // INFO
		}
	}, [level]);

	return (
		<span className={`px-2 py-1 text-xs font-bold rounded-lg border ${color}`}>
			{level}
		</span>
	);
}

export default function LogsPage() {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [level, setLevel] = useState('');
	const [source, setSource] = useState('');
	const [limit, setLimit] = useState(200);

	const fetchLogs = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			if (level) params.append('level', level);
			if (source) params.append('source', source);
			if (limit) params.append('limit', String(limit));

			const res = await fetch(`/api/logs?${params.toString()}`);
			if (!res.ok) throw new Error('Falha ao buscar logs');
			const data = await res.json();
			setLogs(data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='p-4 sm:p-6 lg:p-8 bg-gray-700 rounded-lg min-h-screen'>
			<div className='max-w-7xl mx-auto space-y-8'>
				{/* Título e botão de atualização */}
				<div className='flex items-center justify-between'>
					<h1 className='text-4xl font-black text-white'>Logs do Sistema</h1>
					<button
						onClick={fetchLogs}
						className='px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-600 transition-all'
					>
						🔄 Atualizar
					</button>
				</div>

				{/* Filtros */}
				<div className='bg-gray-600 p-8 rounded-lg shadow-lg space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
						<div>
							<label className='block text-sm font-bold text-white mb-2'>
								Nível
							</label>
							<select
								value={level}
								onChange={(e) => setLevel(e.target.value)}
								className='w-full appearance-none bg-gray-800 text-white px-4 py-3 pr-10 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer'
							>
								<option value=''>Todos</option>
								<option value='INFO'>INFO</option>
								<option value='WARNING'>WARNING</option>
								<option value='ERROR'>ERROR</option>
								<option value='DEBUG'>DEBUG</option>
							</select>
						</div>
						<div>
							<label className='block text-sm font-bold text-white mb-2'>
								Origem
							</label>
							<input
								value={source}
								onChange={(e) => setSource(e.target.value)}
								placeholder='ex: channels'
								className='w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
							/>
						</div>
						<div>
							<label className='block text-sm font-bold text-white mb-2'>
								Limite
							</label>
							<input
								type='number'
								min={1}
								max={1000}
								value={limit}
								onChange={(e) => setLimit(Number(e.target.value))}
								className='w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
							/>
						</div>
						<div className='flex items-end'>
							<button
								onClick={fetchLogs}
								className='w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-bold shadow-md hover:from-green-700 hover:to-green-600 transition-all transform hover:scale-105'
							>
								Filtrar
							</button>
						</div>
					</div>
				</div>

				{/* Tabela de Logs */}
				<div className='bg-gray-600 rounded-lg shadow-lg overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='min-w-full'>
							<thead className='bg-gray-700'>
								<tr>
									<th className='px-4 py-3 text-left text-sm font-bold text-gray-200'>
										Data/Hora
									</th>
									<th className='px-4 py-3 text-left text-sm font-bold text-gray-200'>
										Nível
									</th>
									<th className='px-4 py-3 text-left text-sm font-bold text-gray-200'>
										Origem
									</th>
									<th className='px-4 py-3 text-left text-sm font-bold text-gray-200'>
										Mensagem
									</th>
								</tr>
							</thead>
							<tbody>
								{loading && (
									<tr>
										<td
											colSpan={4}
											className='px-4 py-6 text-center text-gray-400 animate-pulse'
										>
											Carregando...
										</td>
									</tr>
								)}
								{!loading && logs.length === 0 && (
									<tr>
										<td
											colSpan={4}
											className='px-4 py-6 text-center text-gray-400'
										>
											Sem logs para exibir
										</td>
									</tr>
								)}
								{!loading &&
									logs.map((log) => (
										<tr
											key={log.id}
											className='border-t border-gray-500 hover:bg-gray-700/40 transition'
										>
											<td className='px-4 py-3 text-sm text-gray-200'>
												{new Date(log.timestamp).toLocaleString()}
											</td>
											<td className='px-4 py-3'>
												<LevelBadge level={log.level} />
											</td>
											<td className='px-4 py-3 text-sm text-gray-300'>
												{log.source || '-'}
											</td>
											<td className='px-4 py-3 text-sm text-gray-100'>
												{log.message}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
