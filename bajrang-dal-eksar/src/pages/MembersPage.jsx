import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MemberCard from '../components/members/MemberCard';
import MemberForm from '../components/members/MemberForm';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export default function MembersPage() {
  const { members } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [done,     setDone]     = useState(false);

  const approved = members.filter(m => m.status === 'approved');

  const handleSuccess = () => {
    setShowForm(false);
    setDone(true);
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <h1 className="section-heading__title">हमारे सदस्य</h1>
          <span className="section-heading__sub">Our Members</span>
        </div>
        <Button variant="primary" onClick={() => { setShowForm(true); setDone(false); }}>
          + सदस्यता के लिए आवेदन करें
        </Button>
      </div>

      {done && (
        <div className="alert alert--success" style={{ marginBottom: '1.5rem' }}>
          🎉 आपका आवेदन सफलतापूर्वक भेजा गया! Admin की स्वीकृति के बाद आपका नाम यहाँ दिखेगा।
        </div>
      )}

      {approved.length === 0 ? (
        <EmptyState icon="👥" title="अभी कोई स्वीकृत सदस्य नहीं है"
          subtitle="सदस्यता के लिए आवेदन करें और Admin की स्वीकृति का इंतज़ार करें।" />
      ) : (
        <>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            कुल {approved.length} स्वीकृत सदस्य
          </p>
          <div className="members-grid">
            {approved.map(m => <MemberCard key={m.id} member={m} />)}
          </div>
        </>
      )}

      {/* Member Registration Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="सदस्यता आवेदन" maxWidth={600}>
        <div style={{ marginBottom: '1rem', padding: '10px 14px', background: 'var(--gold-light)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--gold)' }}>
          📋 आवेदन भरने के बाद Admin द्वारा समीक्षा की जाएगी। स्वीकृति मिलने पर आपका नाम सदस्य सूची में जुड़ेगा।
        </div>
        <MemberForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
}
