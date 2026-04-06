import React from 'react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../common/EmptyState';

export default function DonationsPanel() {
  const { donations } = useApp();
  const completed = donations.filter(d => d.payment_status === 'completed');
  const total = completed.reduce((s, d) => s + (d.amount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'कुल दान', value: `₹${total.toLocaleString('en-IN')}` },
          { label: 'दानकर्ता',   value: completed.length },
          { label: 'औसत दान',   value: completed.length ? `₹${Math.round(total / completed.length)}` : '—' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ flex: 1, minWidth: 120 }}>
            <div className="stat-card__number">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {donations.length === 0 ? (
        <EmptyState icon="💰" title="अभी कोई दान नहीं" subtitle="दान पृष्ठ सक्रिय होने पर यहाँ दिखेगा।" />
      ) : (
        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th><th>नाम</th><th>मोबाइल</th><th>राशि</th><th>Payment ID</th><th>स्थिति</th><th>तारीख</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d, i) => (
                <tr key={d.id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{d.donor_name}</td>
                  <td style={{ color: 'var(--text-mid)' }}>{d.donor_mobile}</td>
                  <td><strong style={{ color: 'var(--saffron)' }}>₹{d.amount}</strong></td>
                  <td style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-light)' }}>
                    {d.payment_id || '—'}
                  </td>
                  <td>
                    <span className={`badge badge--${d.payment_status === 'completed' ? 'active' : 'idle'}`}>
                      {d.payment_status === 'completed' ? '✓ पूर्ण' : '⏳ प्रतीक्षित'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-light)', fontSize: '0.82rem' }}>
                    {new Date(d.created_at).toLocaleDateString('hi-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
