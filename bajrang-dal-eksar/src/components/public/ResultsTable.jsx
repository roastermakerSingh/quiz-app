import React from 'react';
import { sortByScore, pct } from '../../utils/helpers';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function ResultsTable({ participants }) {
  const sorted = sortByScore(participants);

  return (
    <div className="results-table-wrap">
      <table className="results-table">
        <thead>
          <tr>
            <th>#</th>
            <th>नाम</th>
            <th>मोबाइल</th>
            <th>स्कोर</th>
            <th>प्रतिशत</th>
            <th>तारीख</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr key={i} className={i < 3 ? 'results-table__top' : ''}>
              <td>
                <span className={`rank-badge rank-badge--${Math.min(i + 1, 4)}`}>
                  {i < 3 ? MEDALS[i] : i + 1}
                </span>
              </td>
              <td className="results-table__name">{p.name}</td>
              <td className="results-table__mobile">{p.mobile}</td>
              <td>
                <strong className="results-table__score">{p.score}</strong>
                <span className="results-table__total">/{p.total}</span>
              </td>
              <td>
                <span
                  className="results-table__pct"
                  style={{ color: pct(p.score, p.total) >= 60 ? 'var(--green)' : 'var(--red)' }}
                >
                  {pct(p.score, p.total)}%
                </span>
              </td>
              <td className="results-table__date">{p.date || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
