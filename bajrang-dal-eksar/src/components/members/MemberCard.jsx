import React from 'react';

export default function MemberCard({ member }) {
  return (
    <div className="member-card">
      <div className="member-card__photo">
        {member.photo_url
          ? <img src={member.photo_url} alt={member.name} className="member-card__img" />
          : <span className="member-card__avatar">{member.name.charAt(0).toUpperCase()}</span>
        }
      </div>
      <div className="member-card__info">
        <h3 className="member-card__name">{member.name}</h3>
        <p className="member-card__meta">आयु: {member.age} वर्ष</p>
        {member.address && (
          <p className="member-card__address" title={member.address}>
            📍 {member.address.length > 40 ? member.address.slice(0, 40) + '…' : member.address}
          </p>
        )}
      </div>
    </div>
  );
}
