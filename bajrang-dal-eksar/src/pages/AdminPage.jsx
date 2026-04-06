import React, { useState } from 'react';
import AdminTabs         from '../components/admin/AdminTabs';
import DashboardPanel    from '../components/admin/DashboardPanel';
import QuestionsPanel    from '../components/admin/QuestionsPanel';
import ImagesPanel       from '../components/admin/ImagesPanel';
import ParticipantsPanel from '../components/admin/ParticipantsPanel';
import MembersPanel      from '../components/admin/MembersPanel';
import DonationsPanel    from '../components/admin/DonationsPanel';
import SettingsPanel     from '../components/admin/SettingsPanel';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const panels = {
    dashboard:    <DashboardPanel />,
    questions:    <QuestionsPanel />,
    images:       <ImagesPanel />,
    participants: <ParticipantsPanel />,
    members:      <MembersPanel />,
    donations:    <DonationsPanel />,
    settings:     <SettingsPanel />,
  };

  return (
    <div className="page-container">
      <div className="section-heading">
        <h1 className="section-heading__title">Admin Panel</h1>
        <span className="section-heading__sub">बजरंग दल एकसर — प्रबंधन पैनल</span>
      </div>
      <AdminTabs active={activeTab} onChange={setActiveTab} />
      <div className="admin-panel-body">{panels[activeTab]}</div>
    </div>
  );
}
