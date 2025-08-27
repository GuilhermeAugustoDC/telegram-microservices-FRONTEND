import { useNavigate } from 'react-router-dom';

const SessionList = ({ sessions, onSessionDeleted }) => {
	const navigate = useNavigate();
	const handleDownload = (phoneNumber) => {
		window.location.href = `/api/sessions/download/${phoneNumber}`;
	};

	const handleDelete = async (sessionId) => {
		if (!window.confirm('Deseja realmente apagar esta sessão?')) return;
		try {
			const response = await fetch(`/api/sessions/${sessionId}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Erro ao apagar sessão');
			alert('Sessão apagada com sucesso!');
			if (onSessionDeleted) onSessionDeleted();
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<div className='bg-gray-600 p-6 rounded-lg mt-8'>
			<h3 className='text-xl text-white text-center p-4 font-bold mb-4'>
				Sessões Salvas
			</h3>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-900'>
					<thead className='bg-gray-800'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-black text-white uppercase tracking-wider'>
								Número de Telefone
							</th>
							<th className='px-6 py-3 text-left text-xs font-black text-white uppercase tracking-wider'>
								Ações
							</th>
						</tr>
					</thead>
					<tbody className='bg-gray-900 divide-y divide-gray-200'>
						{sessions.map((session) => (
							<tr key={session.id}>
								<td className='px-6 py-4 whitespace-nowrap text-sm	 font-semibold text-white'>
									{session.phone_number}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
									<button
										onClick={() => handleDownload(session.phone_number)}
										className='inline-block bg-blue-600 text-white font-black px-5 py-1 pl rounded-lg hover:bg-blue-700 transition-colors'
									>
										Baixar
									</button>
									<button
										onClick={() => handleDelete(session.id)}
										className='inline-block bg-red-600 text-white font-black px-5 py-1 rounded-lg hover:bg-red-700 transition-colors'
									>
										Apagar
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default SessionList;
