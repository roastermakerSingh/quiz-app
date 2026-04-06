import React, { useState, useRef } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { supabase, TABLES } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { isValidMobile } from '../../utils/helpers';

export default function MemberForm({ onSuccess }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: '', age: '', address: '', mobile: '', email: '', photo: null,
  });
  const [preview,   setPreview]   = useState(null);
  const [errors,    setErrors]    = useState({});
  const [submitting,setSubmitting]= useState(false);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, photo: 'फ़ोटो 5MB से कम होनी चाहिए' })); return; }
    setForm(f => ({ ...f, photo: file }));
    setPreview(URL.createObjectURL(file));
    setErrors(p => ({ ...p, photo: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name    = 'नाम आवश्यक है';
    if (!form.age || form.age < 5 || form.age > 100) e.age = 'वैध आयु दर्ज करें (5-100)';
    if (!form.address.trim())      e.address = 'पता आवश्यक है';
    if (!isValidMobile(form.mobile)) e.mobile = '10 अंकों का वैध मोबाइल नंबर दर्ज करें';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'वैध ईमेल दर्ज करें';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      // Check unique mobile
      const { data: existing } = await supabase
        .from(TABLES.MEMBERS).select('id').eq('mobile', form.mobile).single();
      if (existing) { setErrors({ mobile: 'यह मोबाइल नंबर पहले से पंजीकृत है' }); setSubmitting(false); return; }

      // Upload photo if provided
      let photoUrl = null, photoPublicId = null;
      if (form.photo) {
        const { url, publicId } = await uploadToCloudinary(form.photo, 'members');
        photoUrl = url;
        photoPublicId = publicId;
      }

      const { error } = await supabase.from(TABLES.MEMBERS).insert({
        name:             form.name.trim(),
        age:              parseInt(form.age),
        address:          form.address.trim(),
        mobile:           form.mobile,
        email:            form.email.trim() || null,
        photo_url:        photoUrl,
        photo_public_id:  photoPublicId,
        status:           'pending',
      });

      if (error) throw error;
      onSuccess?.();
    } catch (err) {
      setErrors({ submit: err.message || 'कुछ गलत हो गया। पुनः प्रयास करें।' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="member-form" onSubmit={handleSubmit} noValidate>
      {/* Photo upload */}
      <div className="member-form__photo-wrap">
        <div className="member-form__photo-preview">
          {preview
            ? <img src={preview} alt="Preview" className="member-form__photo-img" />
            : <span className="member-form__photo-placeholder">👤</span>
          }
        </div>
        <div>
          <label className="btn btn--secondary btn--sm" style={{ cursor: 'pointer' }}>
            📷 फ़ोटो चुनें
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          </label>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 4 }}>JPG/PNG · Max 5MB</p>
          {errors.photo && <p className="form-error">{errors.photo}</p>}
        </div>
      </div>

      <div className="grid-2">
        <Input label="पूरा नाम *" placeholder="जैसे: राम शर्मा"
          value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} />
        <Input label="आयु *" type="number" placeholder="जैसे: 25" min="5" max="100"
          value={form.age} onChange={e => set('age', e.target.value)} error={errors.age} />
      </div>

      <Input label="पता *" placeholder="घर का पूरा पता"
        value={form.address} onChange={e => set('address', e.target.value)} error={errors.address} />

      <div className="grid-2">
        <Input label="मोबाइल नंबर *" placeholder="10 अंकों का नंबर" inputMode="numeric"
          value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} error={errors.mobile} />
        <Input label="ईमेल (वैकल्पिक)" placeholder="email@example.com" type="email"
          value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} />
      </div>

      {errors.submit && (
        <div className="alert alert--error">{errors.submit}</div>
      )}

      <Button type="submit" fullWidth size="lg" loading={submitting}>
        {submitting ? 'सबमिट हो रहा है...' : 'सदस्यता के लिए आवेदन करें →'}
      </Button>
    </form>
  );
}
