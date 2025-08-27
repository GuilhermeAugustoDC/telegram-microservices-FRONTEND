import React, { useState } from 'react';
import ChannelList from '../components/ListChannels/ChannelList';
import CreateAutomationForm from '../components/Automations/CreateAutomationForm';

const CreateAutomationPage = () => {
	const [selectedSession, setSelectedSession] = useState('');
	const [channels, setChannels] = useState([]);
	const [loadingChannels, setLoadingChannels] = useState(false);
	const [errorChannels, setErrorChannels] = useState(null);

	const [sourceChannels, setSourceChannels] = useState('');
	const [destinationChannels, setDestinationChannels] = useState('');

	const addToSource = (id) => {
		setSourceChannels((prev) => (prev ? `${prev}\n${id}` : `${id}`));
	};

	const addToDestination = (id) => {
		setDestinationChannels((prev) => (prev ? `${prev}\n${id}` : `${id}`));
	};

	return (
		<div className='bg-gray-700 p-5 rounded-lg'>
			{/* Título */}
			<h1 className='text-3xl md:text-4xl font-black text-center pb-6 text-white'>
				Automação Telegram
			</h1>

			{/* Grid principal */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(100vh-140px)]'>
				{/* Esquerda: formulário */}
				<div className='h-full overflow-hidden'>
					<CreateAutomationForm
						selectedSession={selectedSession}
						setSelectedSession={setSelectedSession}
						channels={channels}
						setChannels={setChannels}
						sourceChannels={sourceChannels}
						setSourceChannels={setSourceChannels}
						destinationChannels={destinationChannels}
						setDestinationChannels={setDestinationChannels}
						setLoadingChannels={setLoadingChannels}
						setErrorChannels={setErrorChannels}
					/>
				</div>

				{/* Direita: lista de canais */}
				<div className='h-full overflow-hidden'>
					<ChannelList
						channels={channels}
						addToSource={addToSource}
						addToDestination={addToDestination}
						loadingChannels={loadingChannels}
						errorChannels={errorChannels}
					/>
				</div>
			</div>
		</div>
	);
};

export default CreateAutomationPage;
