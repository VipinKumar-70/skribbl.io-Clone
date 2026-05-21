import { create } from 'zustand';

const useGameStore = create((set) => ({
    username: '',
    roomCode: '',
    players: [],
    gameStatus: 'waiting',
    currentWord: '',
    currentDrawer: '',
    currentRound: 1,
    maxRounds: 3,
    timeLeft: 0,
    wordLength: 0,
    winner: null,
    gameOverPlayers: [],
    host: '',

    setUsername: (name) => set({ username: name }),
    setRoomCode: (code) => set({ roomCode: code }),
    setPlayers: (newPlayers) => set({ players: newPlayers }),
    setGameStatus: (status) => set({ gameStatus: status }),
    setCurrentWord: (word) => set({ currentWord: word }),
    setCurrentDrawer: (drawer) => set({ currentDrawer: drawer }),
    setRoundInfo: (round, maxRounds, wordLength, timeLeft) => set({ 
        currentRound: round, maxRounds, wordLength, timeLeft 
    }),
    setTimeLeft: (time) => set({ timeLeft: time }),
    setGameOver: (winner, players) => set({ winner, gameOverPlayers: players, gameStatus: 'ended' }),
    setHost: (host) => set({ host }),

    updatePlayerScore: (username, newScore) =>
        set((state) => ({
            players: state.players.map((p) =>
                p.username === username ? { ...p, score: newScore } : p
            )
        })),

    resetGame: () => set({ 
        roomCode: '', players: [], gameStatus: 'waiting', currentWord: '', 
        currentDrawer: '', currentRound: 1, timeLeft: 0, wordLength: 0, winner: null, gameOverPlayers: [], host: '' 
    })
}));

export default useGameStore;
