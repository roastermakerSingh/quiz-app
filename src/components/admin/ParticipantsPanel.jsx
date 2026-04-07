import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { supabase, TABLES } from '../../lib/supabase';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import { sortByScore, pct } from '../../utils/helpers';

export default function ParticipantsPanel() {
  const { participants, setParticipants } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const sorted   = sortByScore(participants);
  const filtered = sorted.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.mobile.includes(search)
  );

  const handleDeleteAll = async () => {
    if (!window.confirm(`सभी ${participants.length} प्रतिभागी डेटा हटाएं?`)) return;
    await supabase.from(TABLES.PARTICIPANTS).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setParticipants([]);
    toast('सभी प्रतिभागी डेटा हटाया गया', 'info');
  };

  const handleExportCSV = () => {
    const header = 'Rank,Name,Mobile,Score,Total,Percent,Date';
    const rows = sorted.map((p, i) =>
      `${i + 1},${p.name},${p.mobile},${p.score},${p.total},${pct(p.score, p.total)}%,${p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}`
    );
    const blob = new Blob(['\uFEFF' + [header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bajrang-dal-eksar-results.csv';
    a.click();
    toast('CSV डाउनलोड हो रहा है...', 'info');
  };

  return (
    <div className="participants-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, flexWrap: 'wrap' }}>
          <span className="panel-header__count">कुल {participants.length} प्रतिभागी</span>
          <input className="form-input" style={{ maxWidth: 240, margin: 0 }}
            placeholder="नाम या मोबाइल खोजें..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {participants.length > 0 && (
            <>
              <Button variant="secondary" size="sm" onClick={handleExportCSV}>📥 CSV</Button>
              <Button variant="danger"    size="sm" onClick={handleDeleteAll}>सभी हटाएं</Button>
            </>
          )}
        </div>
      </div>

      {participants.length === 0 ? (
        <EmptyState icon="👥" title="कोई प्रतिभागी नहीं" subtitle="क्विज़ शुरू होने पर यहाँ डेटा दिखेगा।" />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🔍" title="कोई परिणाम नहीं" subtitle={`"${search}" के लिए कुछ नहीं मिला।`} />
      ) : (
        <div className="results-table-wrap">
          <table className="results-table">
            <thead><tr><th>#</th><th>नाम</th><th>मोबाइल</th><th>स्कोर</th><th>%</th><th>तारीख</th></tr></thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id || p.mobile}>
                  <td><span className={`rank-badge rank-badge--${Math.min(i + 1, 4)}`}>{i + 1}</span></td>
                  <td className="results-table__name">{p.name}</td>
                  <td className="results-table__mobile">{p.mobile}</td>
                  <td><strong className="results-table__score">{p.score}</strong><span className="results-table__total">/{p.total}</span></td>
                  <td><span className="results-table__pct" style={{ color: pct(p.score, p.total) >= 60 ? 'var(--green)' : 'var(--red)' }}>{pct(p.score, p.total)}%</span></td>
                  <td className="results-table__date">{p.created_at ? new Date(p.created_at).toLocaleDateString('hi-IN') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
