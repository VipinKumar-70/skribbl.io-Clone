import { create } from 'zustand';

const useGameStore = create((set) => ({
    username: '',
    roomCode: '',
    players: [],
    gameStatus: 'waiting',
    
    setUsername: (name) => set({ username: name }),
    setRoomCode: (code) => set({ roomCode: code }),
    setPlayers: (newPlayers) => set({ players: newPlayers }),
    setGameStatus: (status) => set({ gameStatus: status }),
    
    resetGame: () => set({ roomCode: '', players: [], gameStatus: 'waiting' })
}));

export default useGameStore;
