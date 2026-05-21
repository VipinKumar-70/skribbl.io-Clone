import { useState, useEffect, useRef } from 'react';
import socket from '../socket/socket';
import useGameStore from '../store/useGameStore';

export default function ChatBox() {
    const { username, roomCode, updatePlayerScore } = useGameStore();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {

        const handleWrongGuess = (data) => {
            setMessages((prev) => [...prev, {
                username: data.username,
                message: data.message,
                type: 'guess'
            }]);
        };

        const handleCorrectGuess = (data) => {
            setMessages((prev) => [...prev, {
                username: data.username,
                message: data.message,
                type: 'correct'
            }]);

            updatePlayerScore(data.username, data.score);
        };

        const handleChatMessage = (data) => {
            setMessages((prev) => [...prev, {
                username: data.username,
                message: data.message,
                type: 'chat'
            }]);
        };

        socket.on('wrong_guess', handleWrongGuess);
        socket.on('correct_guess', handleCorrectGuess);
        socket.on('chat_message', handleChatMessage);

        return () => {
            socket.off('wrong_guess', handleWrongGuess);
            socket.off('correct_guess', handleCorrectGuess);
            socket.off('chat_message', handleChatMessage);
        };
    }, [updatePlayerScore]);

    const sendMessage = (e) => {
        e.preventDefault();

        const text = input.trim();
        if (!text) return;

        socket.emit('guess', {
            roomCode,
            username,
            message: text
        });

        setMessages((prev) => [
            ...prev,
            { username, message: text, type: 'guess', isMe: true }
        ]);

        setInput('');
    };

    return (
        <div className="w-full md:w-80 bg-white rounded-lg shadow-sm flex flex-col border border-gray-200 order-3 h-64 md:h-auto">
            <div className="p-3 border-b bg-gray-50 rounded-t-lg">
                <h3 className="font-bold text-gray-700">Chat & Guesses</h3>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {messages.length === 0 && (
                    <p className="text-sm text-gray-400 text-center mt-4">
                        No messages yet. Say something!
                    </p>
                )}

                {messages.map((msg, idx) => {

                    if (msg.type === 'correct') {
                        return (
                            <div
                                key={idx}
                                className="text-sm font-bold text-green-600 bg-green-50 p-2 rounded border border-green-100"
                            >
                                {msg.message}
                            </div>
                        );
                    }

                    return (
                        <div
                            key={idx}
                            className={`text-sm p-1 ${
                                msg.isMe ? 'text-blue-700' : 'text-gray-700'
                            }`}
                        >
                            <span className="font-bold">{msg.username}: </span>
                            {msg.message}
                        </div>
                    );
                })}

                <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t bg-gray-50 rounded-b-lg">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 border border-gray-300 p-3 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow text-sm shadow-inner"
                        placeholder="Type your guess..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
