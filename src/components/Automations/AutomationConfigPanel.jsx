import { useState, useEffect } from 'react';

const AutomationConfigPanel = ({ automation, onSave }) => {
	const [formData, setFormData] = useState({
		name: '',
		caption: '',
	});

	useEffect(() => {
		if (automation) {
			setFormData({
				name: automation.name || '',
				caption: automation.caption || '',
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

	const handleSave = () => {
		if (onSave) {
			// envia apenas os campos que queremos atualizar
			onSave({
				id: automation.id,
				name: formData.name,
				caption: formData.caption,
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
					className={`px-2 py-1 rounded text-xs font-bold ${
						automation.is_active
							? 'bg-green-500 text-white'
							: 'bg-red-500 text-white'
					}`}
				>
					{automation.is_active ? 'Rodando' : 'Parado'}
				</span>
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
