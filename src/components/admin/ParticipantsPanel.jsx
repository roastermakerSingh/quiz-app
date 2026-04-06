import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import { sortByScore, pct } from '../../utils/helpers';

export default function ParticipantsPanel() {
  const { participants, setParticipants } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const sorted   = sortByScore(participants);
  const filtered = sorted.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.mobile.includes(search)
  );

  const handleDeleteAll = () => {
    if (!window.confirm(`सभी ${participants.length} प्रतिभागी डेटा हटाएं?`)) return;
    setParticipants([]);
    toast('सभी प्रतिभागी डेटा हटाया गया', 'info');
  };

  const handleExportCSV = () => {
    const header = 'क्रम,नाम,मोबाइल,स्कोर,कुल,प्रतिशत,तारीख';
    const rows   = sorted.map((p, i) =>
      `${i + 1},${p.name},${p.mobile},${p.score},${p.total},${pct(p.score, p.total)}%,${p.date || ''}`
    );
    const csv  = [header, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'bajrang-dal-eksar-results.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('CSV डाउनलोड हो रहा है...', 'info');
  };

  return (
    <div className="participants-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1 }}>
          <span className="panel-header__count">कुल {participants.length} प्रतिभागी</span>
          <input
            className="form-input"
            style={{ maxWidth: 240, margin: 0 }}
            placeholder="नाम या मोबाइल खोजें..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {participants.length > 0 && (
            <>
              <Button variant="secondary" size="sm" onClick={handleExportCSV}>📥 CSV Export</Button>
              <Button variant="danger"    size="sm" onClick={handleDeleteAll}>सभी हटाएं</Button>
            </>
          )}
        </div>
      </div>

      {participants.length === 0 ? (
        <EmptyState icon="👥" title="कोई प्रतिभागी नहीं" subtitle="क्विज़ शुरू होने पर यहाँ डेटा दिखेगा।" />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🔍" title="कोई परिणाम नहीं" subtitle={`"${search}" के लिए कोई प्रतिभागी नहीं मिला।`} />
      ) : (
        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>नाम</th>
                <th>मोबाइल</th>
                <th>स्कोर</th>
                <th>%</th>
                <th>तारीख</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.mobile}>
                  <td><span className={`rank-badge rank-badge--${Math.min(i + 1, 4)}`}>{i + 1}</span></td>
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
      )}
    </div>
  );
}
