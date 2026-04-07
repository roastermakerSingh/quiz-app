import React from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../common/StatCard';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { pct } from '../../utils/helpers';

export default function DashboardPanel() {
  const {
    quizState, setQuizState,
    resultsPublished, setResultsPublished,
    participants, images, questions, members, donations,
  } = useApp();
  const { toast } = useToast();

  const avgScore = participants.length
    ? (participants.reduce((a, p) => a + pct(p.score, p.total), 0) / participants.length).toFixed(1)
    : 0;

  const totalDonated = donations
    .filter(d => d.payment_status === 'completed')
    .reduce((s, d) => s + (d.amount || 0), 0);

  const pendingMembers = members.filter(m => m.status === 'pending').length;

  const handleQuizStart  = () => { setQuizState('active'); toast('क्विज़ शुरू हो गया!', 'success'); };
  const handleQuizStop   = () => { setQuizState('ended');  toast('क्विज़ बंद किया गया।', 'info'); };
  const handleQuizReset  = () => { setQuizState('idle');   toast('क्विज़ रीसेट किया गया।', 'info'); };
  const handlePublish    = () => { setResultsPublished(true);  toast('परिणाम प्रकाशित हुए!', 'success'); };
  const handleUnpublish  = () => { setResultsPublished(false); toast('परिणाम छिपाए गए।', 'info'); };

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="dashboard__stats">
        <StatCard number={participants.length} label="प्रतिभागी" />
        <StatCard number={questions.length}    label="प्रश्न" />
        <StatCard number={images.length}       label="चित्र" />
        <StatCard number={members.filter(m => m.status === 'approved').length} label="सदस्य" />
        <StatCard number={`₹${totalDonated.toLocaleString('en-IN')}`} label="कुल दान" accent />
        <StatCard number={`${avgScore}%`} label="औसत स्कोर" />
      </div>

      {pendingMembers > 0 && (
        <div className="alert alert--warning" style={{ marginBottom: '1.25rem' }}>
          ⏳ <strong>{pendingMembers}</strong> सदस्य आवेदन प्रतीक्षित हैं — Members tab से स्वीकार/अस्वीकार करें।
        </div>
      )}

      {/* Quiz Control */}
      <div className="dashboard__panel">
        <h3 className="dashboard__panel-title">क्विज़ नियंत्रण</h3>
        <div className="dashboard__control-row">
          <div className="dashboard__status-row">
            <span className="dashboard__status-label">स्थिति:</span>
            <Badge variant={quizState === 'active' ? 'active' : quizState === 'ended' ? 'ended' : 'idle'} dot>
              {quizState === 'active' ? 'चालू (Live)' : quizState === 'ended' ? 'समाप्त' : 'निष्क्रिय'}
            </Badge>
          </div>
          <div className="dashboard__btn-row">
            {quizState === 'idle'   && <Button variant="success" onClick={handleQuizStart}>▶ शुरू करें</Button>}
            {quizState === 'active' && <Button variant="danger"  onClick={handleQuizStop}>⏹ बंद करें</Button>}
            {quizState === 'ended'  && <Button variant="secondary" onClick={handleQuizReset}>🔄 रीसेट</Button>}
          </div>
        </div>
      </div>

      {/* Results Control */}
      <div className="dashboard__panel">
        <h3 className="dashboard__panel-title">परिणाम नियंत्रण</h3>
        <div className="dashboard__control-row">
          <div className="dashboard__status-row">
            <span className="dashboard__status-label">परिणाम:</span>
            <Badge variant={resultsPublished ? 'active' : 'idle'} dot>
              {resultsPublished ? 'प्रकाशित ✓' : 'अप्रकाशित'}
            </Badge>
          </div>
          <div className="dashboard__btn-row">
            {!resultsPublished
              ? <Button variant="primary"  onClick={handlePublish}>🏆 प्रकाशित करें</Button>
              : <Button variant="danger"   onClick={handleUnpublish}>🔒 छिपाएं</Button>
            }
          </div>
        </div>
      </div>

      {/* Analytics */}
      {participants.length > 0 && (
        <div className="dashboard__panel">
          <h3 className="dashboard__panel-title">Score Analytics</h3>
          <div className="dashboard__analytics">
            {[
              { label: '80%+',   count: participants.filter(p => pct(p.score, p.total) >= 80).length },
              { label: '60-79%', count: participants.filter(p => { const v = pct(p.score, p.total); return v >= 60 && v < 80; }).length },
              { label: '<60%',   count: participants.filter(p => pct(p.score, p.total) < 60).length  },
            ].map((item, i) => (
              <div key={i} className="dashboard__analytics-item">
                <span className="dashboard__analytics-count">{item.count}</span>
                <span className="dashboard__analytics-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
