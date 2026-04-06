import React from 'react';

const TABS = [
  { id: 'dashboard',    label: '📊 Dashboard'       },
  { id: 'questions',    label: '🧠 प्रश्न प्रबंधन'  },
  { id: 'images',       label: '🖼️ चित्र अपलोड'     },
  { id: 'participants', label: '👥 प्रतिभागी'         },
];

export default function AdminTabs({ active, onChange }) {
  return (
    <div className="admin-tabs">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`admin-tab ${active === tab.id ? 'admin-tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
