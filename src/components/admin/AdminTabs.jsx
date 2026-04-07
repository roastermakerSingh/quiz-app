import React from 'react';
import { useApp } from '../../context/AppContext';

const TABS = [
  { id: 'dashboard',    label: '📊 Dashboard'        },
  { id: 'questions',    label: '🧠 प्रश्न'            },
  { id: 'images',       label: '🖼️ चित्र'             },
  { id: 'participants', label: '👥 प्रतिभागी'          },
  { id: 'members',      label: '🪪 सदस्य'             },
  { id: 'donations',    label: '💰 दान'               },
  { id: 'settings',     label: '⚙️ Settings'          },
];

export default function AdminTabs({ active, onChange }) {
  const { members } = useApp();
  const pendingCount = members.filter(m => m.status === 'pending').length;

  return (
    <div className="admin-tabs">
      {TABS.map(tab => (
        <button key={tab.id}
          className={`admin-tab ${active === tab.id ? 'admin-tab--active' : ''}`}
          onClick={() => onChange(tab.id)}>
          {tab.label}
          {tab.id === 'members' && pendingCount > 0 && (
            <span className="admin-tab__badge">{pendingCount}</span>
          )}
        </button>
      ))}
    </div>
  );
}
