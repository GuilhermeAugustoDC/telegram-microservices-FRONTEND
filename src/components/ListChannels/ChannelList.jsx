import React from 'react';
import { FaBullhorn, FaUsers } from 'react-icons/fa';

const ChannelList = ({
	channels = [],
	addToSource,
	addToDestination,
	loadingChannels,
	errorChannels,
	mode = 'both', // 'source', 'destination' ou 'both'
}) => {
	return (
		<div className='rounded-xl shadow-lg bg-gray-600 p-4'>
			{loadingChannels ? (
				<p className='text-center text-gray-400 py-2 animate-pulse'>
					Carregando canais...
				</p>
			) : errorChannels ? (
				<p className='text-center text-red-400 py-2'>{errorChannels}</p>
			) : channels.length === 0 ? (
				<div className='text-center text-gray-400 py-4'>
					<p>Nenhum canal disponível</p>
					<p className='text-sm mt-2'>
						Verifique se a sessão possui canais cadastrados
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
					{channels.map((channel) => (
						<div
							key={channel.id}
							className='bg-gray-800 rounded-xl p-4 flex flex-col'
						>
							{/* Header do card */}
							<div className='flex items-center'>
								{channel.photo_url ? (
									<img
										src={`http://localhost:8000/app/static/${channel.id}.jpg`}
										alt={channel.title}
										className='w-14 h-14 rounded-full object-cover mr-3 border-2 border-blue-500 dark:border-gray-400 shadow-sm'
									/>
								) : (
									<div className='w-14 h-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-xl mr-3 shadow-sm'>
										{channel.title.charAt(0).toUpperCase()}
									</div>
								)}
								<div className='flex-1 overflow-hidden'>
									<p className='font-semibold text-gray-900 dark:text-white truncate flex items-center text-lg'>
										{channel.is_channel ? (
											<FaBullhorn className='mr-1 text-blue-500 flex-shrink-0' />
										) : (
											<FaUsers className='mr-1 text-green-500 flex-shrink-0' />
										)}
										{channel.title}
									</p>
									<p className='text-xs text-gray-500 dark:text-gray-400'>
										ID: {channel.id}
									</p>
									<p className='text-xs text-gray-500 dark:text-gray-400'>
										Membros: {channel.members_count}
									</p>
								</div>
							</div>

							{/* Botões */}
							<div className='flex justify-end gap-2 mt-2'>
								{(mode === 'source' || mode === 'both') && (
									<button
										onClick={() => addToSource(channel.id)}
										className='bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 text-sm'
									>
										+ Origem
									</button>
								)}
								{(mode === 'destination' || mode === 'both') && (
									<button
										onClick={() => addToDestination(channel.id)}
										className='bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm'
									>
										+ Destino
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ChannelList;
