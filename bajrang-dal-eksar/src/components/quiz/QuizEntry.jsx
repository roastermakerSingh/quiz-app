import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { isValidMobile } from '../../utils/helpers';

export default function QuizEntry({ participants, onStart }) {
  const [form, setForm] = useState({ name: '', mobile: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'नाम आवश्यक है';
    if (!isValidMobile(form.mobile)) e.mobile = '10 अंकों का वैध मोबाइल नंबर दर्ज करें';
    else if (participants.find(p => p.mobile === form.mobile))
      e.mobile = 'यह मोबाइल नंबर पहले से पंजीकृत है';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onStart({ name: form.name.trim(), mobile: form.mobile });
  };

  return (
    <div className="quiz-entry">
      <div className="quiz-entry__header">
        <div className="quiz-entry__icon">📝</div>
        <h2 className="quiz-entry__title">क्विज़ में भाग लें</h2>
        <p className="quiz-entry__sub">अपना नाम और मोबाइल नंबर दर्ज करें</p>
      </div>

      <form className="quiz-entry__form" onSubmit={handleSubmit} noValidate>
        <Input
          label="आपका पूरा नाम *"
          placeholder="जैसे: राम शर्मा"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          autoFocus
        />
        <Input
          label="मोबाइल नंबर *"
          placeholder="10 अंकों का मोबाइल नंबर"
          value={form.mobile}
          onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
          error={errors.mobile}
          inputMode="numeric"
        />

        <div className="quiz-entry__notice">
          <span>📌</span>
          <p>
            प्रत्येक मोबाइल नंबर केवल एक बार क्विज़ दे सकता है।
            प्रत्येक प्रश्न पर <strong>20 सेकंड</strong> का समय दिया जाएगा।
          </p>
        </div>

        <Button type="submit" fullWidth size="lg">
          क्विज़ शुरू करें →
        </Button>
      </form>
    </div>
  );
}
