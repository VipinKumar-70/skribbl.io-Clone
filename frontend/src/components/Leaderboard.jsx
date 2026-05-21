import useGameStore from '../store/useGameStore';

export default function Leaderboard() {
    const { username, players, currentDrawer } = useGameStore();

    const myScore = players.find(p => p.username === username)?.score || 0;

    const allPlayers = [
        { username, score: myScore, isMe: true },
        ...players
    ];

    const sortedPlayers = [...allPlayers].sort((a, b) => b.score - a.score);

    return (
        <div className="w-full md:w-64 bg-white rounded-lg shadow-sm flex flex-col border border-gray-200 order-2 md:order-1 h-48 md:h-auto">
            <div className="p-3 border-b bg-gray-50 rounded-t-lg">
                <h3 className="font-bold text-gray-700">Leaderboard</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {sortedPlayers.map((player, idx) => {
                    const isDrawer = player.username === currentDrawer;

                    return (
                        <div key={idx} className={`p-2 rounded flex justify-between items-center ${player.isMe ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}>
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <span className={`font-bold ${player.isMe ? 'text-blue-700' : 'text-gray-700'}`}>
                                        {player.username}
                                    </span>
                                    {isDrawer && (
                                        <span className="ml-2 text-xs" title="Currently Drawing">✏️</span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500">Rank #{idx + 1}</span>
                            </div>
                            <span className="font-bold text-gray-800">{player.score} pts</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
