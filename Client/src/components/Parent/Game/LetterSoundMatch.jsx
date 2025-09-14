import React, { useState } from 'react';
import './LetterSoundMatch.css';

const cards = [
  { id: 1, label: 'A', pair: 'a', type: 'letter' },
  { id: 2, label: 'B', pair: 'b', type: 'letter' },
  { id: 3, label: 'C', pair: 'c', type: 'letter' },
  { id: 4, label: '🅰️ a', pair: 'a', type: 'sound' },
  { id: 5, label: '🌊 c', pair: 'c', type: 'sound' },
  { id: 6, label: '🅱️ b', pair: 'b', type: 'sound' },
 
];

export default function LetterSoundMatch() {
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleClick = (card, index) => {
    if (flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (selected === null) {
      setSelected({ ...card, index });
    } else {
      if (selected.pair === card.pair && selected.type !== card.type) {
        setMatched([...matched, selected.index, index]);
      }

      setTimeout(() => {
        setFlipped([]);
        setSelected(null);
      }, 700);
    }
  };

  const isMatched = (index) => matched.includes(index);
  const isFlipped = (index) => flipped.includes(index) || isMatched(index);

  return (
    <div className="game-container">
      <h2 className="game-title">🎯 Letter Sound Match 🎯</h2>

      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleClick(card, index)}
            className={`card ${isFlipped(index) ? 'flipped' : ''} ${isMatched(index) ? 'matched' : ''}`}
          >
            {isFlipped(index) ? card.label : '❓'}
          </div>
        ))}
      </div>

      {matched.length === cards.length && (
        <div className="success-message">
          🥳 Excellent! You matched all the pairs!
        </div>
      )}
    </div>
  );
}
