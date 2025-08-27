import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaUsers } from 'react-icons/fa';

const CreateAutomationPage = () => {
	// State for sessions and channels
	const [sessions, setSessions] = useState([]);
	const [selectedSession, setSelectedSession] = useState('');
	const [channels, setChannels] = useState([]);
	const [loadingChannels, setLoadingChannels] = useState(false);
	const [errorChannels, setErrorChannels] = useState(null);

	// State for automation form
	const [automationName, setAutomationName] = useState('');
	const [sourceChannels, setSourceChannels] = useState('');
	const [destinationChannels, setDestinationChannels] = useState('');

	// Fetch sessions on component mount
	useEffect(() => {
		const fetchSessions = async () => {
			try {
				const response = await fetch('/api/sessions/');
				if (!response.ok) throw new Error('Falha ao buscar sessões');
				const data = await response.json();
				setSessions(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchSessions();
	}, []);

	// Handle session selection to fetch channels
	const handleSessionChange = async (e) => {
		const sessionId = e.target.value;
		setSelectedSession(sessionId);
		setChannels([]);
		setErrorChannels(null);

		if (sessionId) {
			await fetchChannels(sessionId, false);
		}
	};

	// Fetch channels function
	const fetchChannels = async (sessionId, incremental = false) => {
		setLoadingChannels(true);
		setErrorChannels(null);
		try {
			const url = incremental
				? `/api/sessions/${sessionId}/channels?incremental=true`
				: `/api/sessions/${sessionId}/channels`;
			const response = await fetch(url);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || 'Falha ao buscar canais');
			}
			const data = await response.json();
			if (incremental) {
				setChannels((prev) => [...prev, ...data]);
			} else {
				setChannels(data);
			}
		} catch (err) {
			setErrorChannels(err.message);
		} finally {
			setLoadingChannels(false);
		}
	};

	// Add channel ID to the correct textarea
	const handleAddChannel = (id, type) => {
		const channelId = String(id);
		if (type === 'source') {
			setSourceChannels((prev) =>
				prev.split('\n').includes(channelId)
					? prev
					: prev
					? `${prev}\n${channelId}`
					: channelId
			);
		} else {
			setDestinationChannels((prev) =>
				prev.split('\n').includes(channelId)
					? prev
					: prev
					? `${prev}\n${channelId}`
					: channelId
			);
		}
	};

	// Handle form submission
	const handleCreateAutomation = async (e) => {
		e.preventDefault();
		if (
			!selectedSession ||
			!automationName ||
			!sourceChannels ||
			!destinationChannels
		) {
			alert(
				'Por favor, preencha todos os campos: nome, sessão, origem e destino.'
			);
			return;
		}

		const source_chat_ids = sourceChannels
			.split('\n')
			.filter((id) => id.trim() !== '')
			.map((id) => parseInt(id));
		const destination_chat_ids = destinationChannels
			.split('\n')
			.filter((id) => id.trim() !== '')
			.map((id) => parseInt(id));

		try {
			const response = await fetch('/api/automations/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: automationName,
					session_id: parseInt(selectedSession),
					source_chat_ids: source_chat_ids,
					destination_chat_ids: destination_chat_ids,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.detail || 'Falha ao criar automação');
			}

			alert('Automação criada com sucesso!');
			setAutomationName('');
			setSourceChannels('');
			setDestinationChannels('');
		} catch (error) {
			console.error(error);
			alert(`Erro: ${error.message}`);
		}
	};

	return (
		<div className='p-4 sm:p-6 lg:p-8 bg-gray-700 rounded-lg min-h-screen'>
			<div className='max-w-7xl mx-auto space-y-8'>
				<h1 className='text-4xl font-black text-center pb-4 text-white'>
					Listar Canais e Grupos
				</h1>

				{/* Automation Form */}
				<form
					onSubmit={handleCreateAutomation}
					className='bg-gray-600 p-8 rounded-lg space-y-6'
				>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className=''>
							<label
								htmlFor='session-select'
								className='block text-lg font-black text-white mb-2'
							>
								Sessão
							</label>

							<div className='relative'>
								<select
									id='session-select'
									value={selectedSession}
									onChange={handleSessionChange}
									className='w-full appearance-none bg-gray-800 text-white px-4 py-3 pr-10 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer'
									required
								>
									<option value=''>-- Selecione uma Sessão --</option>
									{sessions.map((session) => (
										<option key={session.id} value={session.id}>
											{session.phone_number}
										</option>
									))}
								</select>

								{/* Ícone seta customizado */}
								<div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
									<svg
										className='w-5 h-5 text-gray-400'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M19 9l-7 7-7-7'
										/>
									</svg>
								</div>
							</div>
						</div>
						<div className=''>
							<label
								htmlFor='automation-name'
								className='block text-lg font-black text-white mb-2'
							>
								Nome da Automação
							</label>

							<input
								type='text'
								id='automation-name'
								value={automationName}
								onChange={(e) => setAutomationName(e.target.value)}
								className='w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
								placeholder='Digite um nome...'
								required
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label
								htmlFor='source-channels'
								className='block text-lg font-black text-gray-200 mb-2'
							>
								Canais de Origem
								<span className='text-gray-400 text-xs'>(um ID por linha)</span>
							</label>
							<textarea
								id='source-channels'
								value={sourceChannels}
								onChange={(e) => setSourceChannels(e.target.value)}
								rows='5'
								className='w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none'
								placeholder='-1234567890&#10;-0987654321&#10;'
								required
							></textarea>
						</div>

						<div>
							<label
								htmlFor='destination-channels'
								className='block text-lg font-black text-gray-200 mb-2'
							>
								Canais de Destino{' '}
								<span className='text-gray-400 text-xs'>(um ID por linha)</span>
							</label>
							<textarea
								id='destination-channels'
								value={destinationChannels}
								onChange={(e) => setDestinationChannels(e.target.value)}
								rows='5'
								className='w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none'
								placeholder='-1234567890&#10;-0987654321&#10;'
								required
							></textarea>
						</div>
					</div>

					<button
						type='submit'
						className='w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300'
					>
						Criar Automação
					</button>
				</form>

				{/* Channels List */}
				{selectedSession && (
					<div className='bg-white dark:bg-gray-600 p-8 rounded-lg shadow-lg transition-colors duration-300'>
						{/* Cabeçalho */}
						<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
							<h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white'>
								Canais e Grupos Disponíveis ({channels.length})
							</h2>

							<div className='flex flex-wrap gap-2'>
								<button
									onClick={() => fetchChannels(selectedSession, false)}
									className='font-semibold flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm shadow-sm disabled:opacity-60'
									disabled={loadingChannels}
								>
									Atualizar Tudo
								</button>
								<button
									onClick={() => fetchChannels(selectedSession, true)}
									className='font-semibold flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm shadow-sm disabled:opacity-60'
									disabled={loadingChannels}
									title='Buscar apenas novos canais'
								>
									Buscar Novos
								</button>
							</div>
						</div>

						{/* Loading / Erro */}
						{loadingChannels && (
							<p className='text-center text-gray-500 dark:text-gray-400 py-6 animate-pulse'>
								Carregando canais...
							</p>
						)}
						{errorChannels && (
							<p className='text-center text-red-600 dark:text-red-400 font-semibold py-6'>
								Erro: {errorChannels}
							</p>
						)}

						{/* Lista */}
						{!loadingChannels && !errorChannels && (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{channels.map((channel) => (
									<div
										key={channel.id}
										className='bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition'
									>
										{/* Cabeçalho do card */}
										<div className='flex items-center mb-4'>
											{channel.photo_url ? (
												<img
													src={`http://localhost:8000/app/static/${channel.id}.jpg`}
													alt={channel.title}
													className='w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-600 shadow-sm'
												/>
											) : (
												<div className='w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-sm'>
													{channel.title.charAt(0).toUpperCase()}
												</div>
											)}

											<div className='flex-1 overflow-hidden'>
												<p
													className='font-bold text-gray-900 dark:text-white truncate flex items-center'
													title={channel.title}
												>
													{channel.is_channel ? (
														<FaBullhorn className='mr-2 text-blue-500 flex-shrink-0' />
													) : (
														<FaUsers className='mr-2 text-green-500 flex-shrink-0' />
													)}
													{channel.title}
												</p>
												<p className='text-sm text-gray-500 dark:text-gray-400'>
													ID:{' '}
													<span className='font-semibold text-gray-700 dark:text-gray-200'>
														{channel.id}
													</span>
												</p>
												<p className='text-sm text-gray-500 dark:text-gray-400'>
													Membros:{' '}
													<span className='font-semibold text-gray-700 dark:text-gray-200'>
														{channel.members_count}
													</span>
												</p>
											</div>
										</div>

										{/* Ações */}
										<div className='flex justify-end space-x-2 mt-auto pt-4 border-t border-gray-200 dark:border-gray-600'>
											<button
												type='button'
												onClick={() => handleAddChannel(channel.id, 'source')}
												className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm font-semibold shadow-sm transition-transform transform hover:scale-105'
											>
												+ Origem
											</button>
											<button
												type='button'
												onClick={() =>
													handleAddChannel(channel.id, 'destination')
												}
												className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-semibold shadow-sm transition-transform transform hover:scale-105'
											>
												+ Destino
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default CreateAutomationPage;
