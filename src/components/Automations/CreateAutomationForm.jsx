import React, { useState, useEffect } from 'react';

const CreateAutomationForm = ({
	selectedSession,
	setSelectedSession,
	channels,
	setChannels,
	sourceChannels,
	setSourceChannels,
	destinationChannels,
	setDestinationChannels,
	setLoadingChannels,
	setErrorChannels,
}) => {
	const [automationName, setAutomationName] = useState('');
	const [sessions, setSessions] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchSessions = async () => {
			try {
				const res = await fetch('/api/sessions/');
				if (!res.ok) {
					const errData = await res.json().catch(() => ({}));
					throw new Error(errData.detail || 'Falha ao buscar sessões');
				}
				const data = await res.json();
				setSessions(data);
			} catch (err) {
				console.error(err);
			}
		};
		fetchSessions();
	}, []);

	const handleSessionChange = async (e) => {
		const sessionId = e.target.value;
		setSelectedSession(sessionId);

		if (!sessionId) {
			setChannels([]);
			return;
		}

		try {
			setLoadingChannels(true);
			setErrorChannels(null);

			const res = await fetch(`/api/sessions/${sessionId}/channels`);
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				throw new Error(data.detail || 'Falha ao buscar canais');
			}
			setChannels(data);
		} catch (err) {
			setErrorChannels(err.message || 'Erro desconhecido');
		} finally {
			setLoadingChannels(false);
		}
	};

	const handleCreateAutomation = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);

		const src = (sourceChannels || '').trim();
		const dst = (destinationChannels || '').trim();

		if (!selectedSession || !automationName || !src || !dst) {
			alert('Preencha todos os campos.');
			setIsSubmitting(false);
			return;
		}

		const source_chats = src
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line !== '');

		const destination_chats = dst
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line !== '');

		try {
			const res = await fetch('/api/automations/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: automationName,
					session_id: parseInt(selectedSession, 10),
					source_chats,
					destination_chats,
				}),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.detail || 'Falha ao criar automação');
			}

			alert('✅ Automação criada com sucesso!');
			setAutomationName('');
			setSourceChannels('');
			setDestinationChannels('');
			setChannels([]);
			setSelectedSession('');
		} catch (err) {
			alert(err.message || 'Erro ao criar automação');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleCreateAutomation}
			className='bg-gray-600 p-6 rounded-xl shadow-lg space-y-5 overflow-y-auto'
		>
			<div>
				<label className='block text-white font-semibold mb-2'>Sessão</label>
				<select
					value={selectedSession}
					onChange={handleSessionChange}
					className='w-full p-3 rounded-md bg-gray-800 text-white border border-gray-500 focus:ring-2 focus:ring-green-500 outline-none'
				>
					<option value=''>-- Selecione uma Sessão --</option>
					{sessions.map((s) => (
						<option key={s.id} value={s.id}>
							{s.phone_number}
						</option>
					))}
				</select>
			</div>

			<div>
				<label className='block text-white font-semibold mb-2'>
					Nome da Automação
				</label>
				<input
					type='text'
					value={automationName}
					onChange={(e) => setAutomationName(e.target.value)}
					className='w-full p-3 rounded-md bg-gray-800 text-white border border-gray-500 focus:ring-2 focus:ring-green-500 outline-none'
					placeholder='Digite um nome...'
				/>
			</div>

			<div>
				<label className='block text-white font-semibold mb-2'>
					Canais de Origem
				</label>
				<textarea
					value={sourceChannels}
					onChange={(e) => setSourceChannels(e.target.value)}
					rows={3}
					className='w-full p-3 rounded-md bg-gray-800 text-white border border-gray-500 focus:ring-2 focus:ring-green-500 outline-none'
					placeholder='IDs separados por quebra de linha'
				/>
			</div>

			<div>
				<label className='block text-white font-semibold mb-2'>
					Canais de Destino
				</label>
				<textarea
					value={destinationChannels}
					onChange={(e) => setDestinationChannels(e.target.value)}
					rows={3}
					className='w-full p-3 rounded-md bg-gray-800 text-white border border-gray-500 focus:ring-2 focus:ring-green-500 outline-none'
					placeholder='IDs separados por quebra de linha'
				/>
			</div>

			<button
				type='submit'
				disabled={isSubmitting}
				className={`w-full ${
					isSubmitting
						? 'bg-gray-400 cursor-not-allowed'
						: 'bg-green-500 hover:bg-green-600'
				} text-white font-bold py-3 rounded-lg shadow-md transition`}
			>
				{isSubmitting ? 'Criando...' : 'Criar Automação'}
			</button>
		</form>
	);
};

export default CreateAutomationForm;
