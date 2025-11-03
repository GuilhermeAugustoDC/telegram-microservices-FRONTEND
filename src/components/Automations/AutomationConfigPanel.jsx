import { useState, useEffect } from 'react';
import ChannelList from '../ListChannels/ChannelList';

const AutomationConfigPanel = ({ automation, onSave }) => {
	const [formData, setFormData] = useState({
		name: '',
		caption: '',
		source_channels: [],
		destination_channels: [],
	});
	const [channels, setChannels] = useState([]);
	const [showSourceSelector, setShowSourceSelector] = useState(false);
	const [showDestSelector, setShowDestSelector] = useState(false);
	const [loadingChannels, setLoadingChannels] = useState(false);

	useEffect(() => {
		if (automation) {
			setFormData({
				name: automation.name || '',
				caption: automation.caption || '',
				source_channels: automation.source_channels
					? automation.source_channels.map((ch) => ch.chat_id || '')
					: [],
				destination_channels: automation.destination_channels
					? automation.destination_channels.map((ch) => ch.chat_id || '')
					: [],
			});
		}
	}, [automation]);

	if (!automation) {
		return (
			<div className='bg-gray-700 text-gray-300 rounded-lg p-6 text-center mt-6'>
				<span>Nenhuma automação selecionada.</span>
			</div>
		);
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleChannelChange = (type, idx, value) => {
		setFormData((prev) => {
			const arr = [...prev[type]];
			arr[idx] = value;
			return { ...prev, [type]: arr };
		});
	};

	const handleAddChannel = (type) => {
		setFormData((prev) => ({
			...prev,
			[type]: [...prev[type], ''],
		}));
	};

	const handleRemoveChannel = (type, idx) => {
		setFormData((prev) => {
			const arr = [...prev[type]];
			arr.splice(idx, 1);
			return { ...prev, [type]: arr };
		});
	};

	const handleSave = () => {
		if (onSave) {
			onSave({
				id: automation.id,
				name: formData.name,
				caption: formData.caption,
				source_channels: formData.source_channels.filter(Boolean),
				destination_channels: formData.destination_channels.filter(Boolean),
			});
		}
	};

	return (
		<div className='max-w-2xl mt-8 bg-gray-700 rounded-lg shadow-lg p-8'>
			<h2 className='text-2xl font-bold text-white mb-4'>
				Configurações da Automação
			</h2>

			{/* Nome (somente leitura) */}
			<div className='mb-4'>
				<label className='block text-gray-300 mb-1 font-semibold'>Nome</label>
				<input
					type='text'
					className='rounded px-3 py-2 bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
					value={formData.name}
					readOnly
				/>
			</div>

			{/* Status */}
			<div className='mb-4'>
				<label className='block text-gray-300 mb-1 font-semibold'>Status</label>
				<span
					className={`px-2 py-1 rounded text-xs font-bold ${automation.is_active
						? 'bg-green-500 text-white'
						: 'bg-red-500 text-white'
						}`}
				>
					{automation.is_active ? 'Rodando' : 'Parado'}
				</span>
			</div>

			{/* Canais de Origem */}
			<div className='mb-4'>
				<label className='block text-gray-300 mb-1 font-semibold'>
					Canais de Origem
				</label>
				<div className='space-y-2'>
					{formData.source_channels.map((chatId, idx) => (
						<div key={idx} className='flex items-center gap-2'>
							<div className='flex-1 px-3 py-2 bg-gray-800 rounded text-gray-100'>
								{channels.find((ch) => String(ch.id) === String(chatId))
									?.title || chatId}
							</div>
							<button
								onClick={() => handleRemoveChannel('source_channels', idx)}
								className='text-red-400 hover:text-red-600'
							>
								✕
							</button>
						</div>
					))}

					<div className='relative'>
						<button
							onClick={() => setShowSourceSelector((prev) => !prev)}
							className='text-blue-400 hover:text-blue-600 text-sm'
						>
							+ Adicionar canal de origem
						</button>

						{showSourceSelector && (
							<div className='absolute top-full left-0 mt-1 w-[500px] z-10'>
								<ChannelList
									channels={channels.filter(
										(ch) => !formData.source_channels.includes(String(ch.id))
									)}
									addToSource={(id) => {
										handleAddChannel('source_channels', String(id));
										setShowSourceSelector(false);
									}}
									addToDestination={() => { }}
									mode='source'
									loadingChannels={loadingChannels}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Canais de Destino */}
			<div className='mb-4'>
				<label className='block text-gray-300 mb-1 font-semibold'>
					Canais de Destino
				</label>
				<div className='space-y-2'>
					{formData.destination_channels.map((chatId, idx) => (
						<div key={idx} className='flex items-center gap-2'>
							<div className='flex-1 px-3 py-2 bg-gray-800 rounded text-gray-100'>
								{channels.find((ch) => String(ch.id) === String(chatId))
									?.title || chatId}
							</div>
							<button
								onClick={() => handleRemoveChannel('destination_channels', idx)}
								className='text-red-400 hover:text-red-600'
							>
								✕
							</button>
						</div>
					))}
					<div className='relative'>
						<button
							onClick={() => setShowDestSelector((prev) => !prev)}
							className='text-blue-400 hover:text-blue-600 text-sm'
						>
							+ Adicionar canal de destino
						</button>
						{showDestSelector && (
							<div className='absolute top-full left-0 mt-1 w-[500px] z-10'>
								<ChannelList
									channels={channels.filter(
										(ch) =>
											!formData.destination_channels.includes(String(ch.id))
									)}
									addToSource={() => { }}
									addToDestination={(id) => {
										handleAddChannel('destination_channels', String(id));
										setShowDestSelector(false);
									}}
									mode='destination'
									loadingChannels={loadingChannels}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Legenda personalizada */}
			<div className='mb-4'>
				<label className='block text-gray-300 mb-1 font-semibold'>
					Legenda personalizada
				</label>
				<textarea
					name='caption'
					rows={3}
					className='w-full rounded px-3 py-2 bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
					value={formData.caption}
					onChange={handleChange}
					placeholder='Digite a legenda que será adicionada às mensagens encaminhadas...'
				/>
			</div>

			{/* Botão Salvar */}
			<div className='flex justify-end mt-6'>
				<button
					className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition'
					onClick={handleSave}
				>
					Salvar Alterações
				</button>
			</div>
		</div>
	);
};

export default AutomationConfigPanel;
