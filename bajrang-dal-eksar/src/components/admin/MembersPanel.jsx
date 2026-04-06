import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { supabase, TABLES } from '../../lib/supabase';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';

const STATUS_TABS = [
  { id: 'pending',  label: 'प्रतीक्षित',   variant: 'idle'    },
  { id: 'approved', label: 'स्वीकृत',       variant: 'active'  },
  { id: 'rejected', label: 'अस्वीकृत',      variant: 'ended'   },
];

export default function MembersPanel() {
  const { members, setMembers } = useApp();
  const { toast } = useToast();
  const [tab, setTab] = useState('pending');
  const [processing, setProcessing] = useState(null);

  const filtered = members.filter(m => m.status === tab);

  const updateStatus = async (id, status) => {
    setProcessing(id);
    const { error } = await supabase.from(TABLES.MEMBERS).update({ status }).eq('id', id);
    if (error) { toast('अपडेट में समस्या हुई', 'error'); setProcessing(null); return; }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    toast(status === 'approved' ? 'सदस्य स्वीकृत किया गया ✓' : 'सदस्य अस्वीकृत किया गया', status === 'approved' ? 'success' : 'info');
    setProcessing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('इस सदस्य को हमेशा के लिए हटाएं?')) return;
    const { error } = await supabase.from(TABLES.MEMBERS).delete().eq('id', id);
    if (error) { toast('हटाने में समस्या', 'error'); return; }
    setMembers(prev => prev.filter(m => m.id !== id));
    toast('सदस्य हटाया गया', 'info');
  };

  const counts = {
    pending:  members.filter(m => m.status === 'pending').length,
    approved: members.filter(m => m.status === 'approved').length,
    rejected: members.filter(m => m.status === 'rejected').length,
  };

  return (
    <div className="members-panel">
      {/* Status tabs */}
      <div className="members-panel__tabs">
        {STATUS_TABS.map(t => (
          <button key={t.id}
            className={`members-status-tab ${tab === t.id ? 'members-status-tab--active' : ''}`}
            onClick={() => setTab(t.id)}>
            {t.label}
            <span className="members-status-tab__count">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={tab === 'pending' ? '⏳' : tab === 'approved' ? '✅' : '❌'}
          title={`कोई ${STATUS_TABS.find(t2 => t2.id === tab)?.label} सदस्य नहीं`} />
      ) : (
        <div className="member-admin-list">
          {filtered.map(m => (
            <div key={m.id} className="member-admin-card">
              <div className="member-admin-card__photo">
                {m.photo_url
                  ? <img src={m.photo_url} alt={m.name} />
                  : <span>{m.name.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div className="member-admin-card__info">
                <div className="member-admin-card__name">{m.name}</div>
                <div className="member-admin-card__meta">
                  आयु: {m.age} &nbsp;|&nbsp; 📱 {m.mobile}
                  {m.email && <> &nbsp;|&nbsp; ✉️ {m.email}</>}
                </div>
                <div className="member-admin-card__address">📍 {m.address}</div>
                <div className="member-admin-card__date">
                  {new Date(m.created_at).toLocaleDateString('hi-IN')}
                </div>
              </div>
              <div className="member-admin-card__actions">
                {tab === 'pending' && (
                  <>
                    <Button variant="success" size="sm"
                      loading={processing === m.id}
                      onClick={() => updateStatus(m.id, 'approved')}>
                      ✓ स्वीकार
                    </Button>
                    <Button variant="danger" size="sm"
                      loading={processing === m.id}
                      onClick={() => updateStatus(m.id, 'rejected')}>
                      ✕ अस्वीकार
                    </Button>
                  </>
                )}
                {tab === 'approved' && (
                  <Button variant="danger" size="sm"
                    loading={processing === m.id}
                    onClick={() => updateStatus(m.id, 'rejected')}>
                    निलंबित करें
                  </Button>
                )}
                {tab === 'rejected' && (
                  <Button variant="success" size="sm"
                    loading={processing === m.id}
                    onClick={() => updateStatus(m.id, 'approved')}>
                    पुनः स्वीकार करें
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)}>🗑️</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
