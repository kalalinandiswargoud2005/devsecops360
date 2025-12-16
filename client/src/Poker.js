import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to your Backend (Change this to your Render URL later for Production!)
// For now, use localhost to test locally
const socket = io('https://devsecops-backend-g7qn.onrender.com'); 

const CARDS = [1, 2, 3, 5, 8, 13, 20, '?'];

function Poker() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [gameState, setGameState] = useState({ votes: {}, show: false });

  useEffect(() => {
    socket.on('gameState', (data) => {
      setGameState(data);
    });
    return () => socket.off('gameState'); // Cleanup
  }, []);

  const handleJoin = () => {
    if (username) setJoined(true);
  };

  const sendVote = (value) => {
    socket.emit('vote', { user: username, value });
  };

  const reveal = () => socket.emit('reveal');
  const reset = () => socket.emit('reset');

  if (!joined) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>
        <h2>Enter Name to Join Poker</h2>
        <input 
          style={{ padding: '10px', fontSize: '16px' }}
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <button 
          style={{ padding: '10px 20px', marginLeft: '10px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}
          onClick={handleJoin}>
          Join Table
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
      <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Agile Estimation (Scrum Poker)</h2>
      
      {/* 1. The Card Selection Area */}
      <div style={{ margin: '20px 0' }}>
        <h3>Select Your Estimate:</h3>
        {CARDS.map(card => (
          <button 
            key={card}
            onClick={() => sendVote(card)}
            style={{ 
              width: '50px', height: '70px', margin: '5px', 
              fontSize: '20px', borderRadius: '5px', cursor: 'pointer',
              backgroundColor: gameState.votes[username] === card ? '#22c55e' : '#1e293b',
              color: 'white', border: '1px solid #94a3b8'
            }}
          >
            {card}
          </button>
        ))}
      </div>

      {/* 2. Controls */}
      <div style={{ margin: '30px' }}>
        <button onClick={reveal} style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#f97316', border: 'none', color: 'white', cursor: 'pointer' }}>Reveal Cards</button>
        <button onClick={reset} style={{ padding: '10px 20px', backgroundColor: '#ef4444', border: 'none', color: 'white', cursor: 'pointer' }}>Reset Game</button>
      </div>

      {/* 3. The Team Table (Results) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {Object.entries(gameState.votes).map(([user, value]) => (
          <div key={user} style={{ 
            width: '100px', height: '140px', backgroundColor: '#334155', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderRadius: '10px', border: '2px solid #64748b'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold' }}>
              {gameState.show ? value : '✅'}
            </div>
            <div style={{ marginTop: '10px', color: '#94a3b8' }}>{user}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Poker;