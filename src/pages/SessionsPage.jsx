import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SessionList from '../components/SessionList';
import {
	FiHome,
	FiPlusCircle,
	FiList,
	FiEye,
	FiRadio,
	FiFileText,
} from 'react-icons/fi';
const SessionsPage = () => {
	const [sessions, setSessions] = useState([]);

	const fetchSessions = async () => {
		try {
			const response = await fetch('/api/sessions/');
			if (!response.ok) throw new Error('Falha ao buscar sessões');
			const data = await response.json();
			setSessions(data);
		} catch (error) {
			console.error(error);
			alert(`Erro: ${error.message}`);
		}
	};

	useEffect(() => {
		fetchSessions();
	}, []);

	return (
		<div className='bg-gray-700 p-5 rounded-lg'>
			<h1 className='text-3xl text-center font-extrabold text-white mb-5'>
				Gerenciar Sessões
			</h1>
			<div className='mt-6 text-center'>
				<Link
					to='/create-session'
					className='inline-block bg-green-600 text-white font-black px-8 py-3 rounded-lg hover:bg-green-700 transition-colors'
				>
					<span>Criar Nova Sessão</span>
				</Link>
			</div>
			<div>
				<SessionList sessions={sessions} onSessionDeleted={fetchSessions} />
			</div>
		</div>
	);
};

export default SessionsPage;
