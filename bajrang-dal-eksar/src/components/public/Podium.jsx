import React from 'react';
import { sortByScore, pct } from '../../utils/helpers';

export default function Podium({ participants }) {
  const sorted = sortByScore(participants);
  if (sorted.length < 1) return null;

  const [first, second, third] = sorted;

  // Display order: 2nd, 1st, 3rd (classic podium layout)
  const podiumOrder = [
    { player: second, rank: 2, medal: '🥈', height: 100 },
    { player: first,  rank: 1, medal: '🥇', height: 130 },
    { player: third,  rank: 3, medal: '🥉', height: 80  },
  ];

  return (
    <div className="podium">
      {podiumOrder.map(({ player, rank, medal, height }) =>
        player ? (
          <div key={rank} className={`podium__place podium__place--${rank}`}>
            <div className="podium__medal">{medal}</div>
            <div className="podium__name">{player.name}</div>
            <div className="podium__score">
              {player.score}/{player.total}
              <span className="podium__pct"> ({pct(player.score, player.total)}%)</span>
            </div>
            <div className="podium__block" style={{ height }}>
              <span className="podium__rank">#{rank}</span>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
