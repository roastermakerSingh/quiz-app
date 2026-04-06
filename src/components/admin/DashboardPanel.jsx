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
    participants, images, questions,
  } = useApp();
  const { toast } = useToast();

  const avgScore = participants.length
    ? (participants.reduce((a, p) => a + pct(p.score, p.total), 0) / participants.length).toFixed(1)
    : 0;

  const handleQuizStart  = () => { setQuizState('active'); toast('क्विज़ शुरू हो गया!', 'success'); };
  const handleQuizStop   = () => { setQuizState('ended');  toast('क्विज़ बंद किया गया।', 'info');   };
  const handleQuizReset  = () => { setQuizState('idle');   toast('क्विज़ रीसेट किया गया।', 'info'); };
  const handlePublish    = () => { setResultsPublished(true);  toast('परिणाम प्रकाशित हुए!', 'success'); };
  const handleUnpublish  = () => { setResultsPublished(false); toast('परिणाम छिपाए गए।', 'info');       };

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="dashboard__stats">
        <StatCard number={participants.length} label="कुल प्रतिभागी" />
        <StatCard number={questions.length}    label="कुल प्रश्न"    />
        <StatCard number={images.length}       label="कुल चित्र"     />
        <StatCard number={`${avgScore}%`}      label="औसत स्कोर"    accent />
      </div>

      {/* Quiz Control */}
      <div className="dashboard__panel">
        <h3 className="dashboard__panel-title">क्विज़ नियंत्रण</h3>
        <div className="dashboard__control-row">
          <div className="dashboard__status-row">
            <span className="dashboard__status-label">वर्तमान स्थिति:</span>
            <Badge
              variant={quizState === 'active' ? 'active' : quizState === 'ended' ? 'ended' : 'idle'}
              dot
            >
              {quizState === 'active' ? 'चालू (Live)' : quizState === 'ended' ? 'समाप्त' : 'निष्क्रिय'}
            </Badge>
          </div>
          <div className="dashboard__btn-row">
            {quizState === 'idle'   && <Button variant="success" onClick={handleQuizStart}>▶ क्विज़ शुरू करें</Button>}
            {quizState === 'active' && <Button variant="danger"  onClick={handleQuizStop}>⏹ क्विज़ बंद करें</Button>}
            {quizState === 'ended'  && <Button variant="secondary" onClick={handleQuizReset}>🔄 रीसेट करें</Button>}
          </div>
        </div>
        <p className="dashboard__hint">
          {quizState === 'idle'   && 'क्विज़ शुरू करने पर सभी यूज़र क्विज़ दे सकेंगे।'}
          {quizState === 'active' && '🟢 क्विज़ अभी लाइव है। प्रतिभागी भाग ले रहे हैं।'}
          {quizState === 'ended'  && 'क्विज़ समाप्त। परिणाम प्रकाशित करें या रीसेट करें।'}
        </p>
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
              ? <Button variant="primary"  onClick={handlePublish}>🏆 परिणाम प्रकाशित करें</Button>
              : <Button variant="danger"   onClick={handleUnpublish}>🔒 परिणाम छिपाएं</Button>
            }
          </div>
        </div>
        <p className="dashboard__hint">
          {resultsPublished
            ? 'परिणाम पृष्ठ सभी यूज़र को दिखाई दे रहा है।'
            : 'परिणाम प्रकाशित करने पर नेविगेशन में "परिणाम" लिंक दिखेगा।'}
        </p>
      </div>

      {/* Analytics */}
      {participants.length > 0 && (
        <div className="dashboard__panel">
          <h3 className="dashboard__panel-title">Analytics</h3>
          <div className="dashboard__analytics">
            {[
              { label: '80%+ स्कोर',  count: participants.filter(p => pct(p.score, p.total) >= 80).length },
              { label: '60-79% स्कोर', count: participants.filter(p => { const v = pct(p.score, p.total); return v >= 60 && v < 80; }).length },
              { label: '60% से कम',   count: participants.filter(p => pct(p.score, p.total) < 60).length  },
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
