import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { supabase, TABLES } from '../../lib/supabase';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';

const LETTERS = ['A', 'B', 'C', 'D'];
const BLANK = { question: '', options: ['', '', '', ''], correct: 0 };

export default function QuestionsPanel() {
  const { questions, setQuestions } = useApp();
  const { toast } = useToast();
  const [isOpen,   setIsOpen]   = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);

  const openAdd = () => { setEditId(null); setForm(BLANK); setErrors({}); setIsOpen(true); };
  const openEdit = (q) => {
    setEditId(q.id);
    setForm({ question: q.question, options: [...q.options], correct: q.correct });
    setErrors({});
    setIsOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.question.trim()) e.question = 'प्रश्न आवश्यक है';
    form.options.forEach((o, i) => { if (!o.trim()) e[`opt${i}`] = 'विकल्प आवश्यक है'; });
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (editId) {
        const { data, error } = await supabase.from(TABLES.QUESTIONS)
          .update({ question: form.question, options: form.options, correct: form.correct })
          .eq('id', editId).select().single();
        if (error) throw error;
        setQuestions(qs => qs.map(q => q.id === editId ? data : q));
        toast('प्रश्न अपडेट किया गया ✓', 'success');
      } else {
        const { data, error } = await supabase.from(TABLES.QUESTIONS)
          .insert({ question: form.question, options: form.options, correct: form.correct })
          .select().single();
        if (error) throw error;
        setQuestions(qs => [...qs, data]);
        toast('नया प्रश्न जोड़ा गया ✓', 'success');
      }
      setIsOpen(false);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('इस प्रश्न को हटाएं?')) return;
    const { error } = await supabase.from(TABLES.QUESTIONS).delete().eq('id', id);
    if (error) { toast('हटाने में समस्या', 'error'); return; }
    setQuestions(qs => qs.filter(q => q.id !== id));
    toast('हटाया गया', 'info');
  };

  const setOption = (i, val) => {
    const options = [...form.options];
    options[i] = val;
    setForm(f => ({ ...f, options }));
  };

  return (
    <div className="questions-panel">
      <div className="panel-header">
        <span className="panel-header__count">कुल {questions.length} प्रश्न</span>
        <Button onClick={openAdd}>+ नया प्रश्न जोड़ें</Button>
      </div>

      {questions.length === 0 ? (
        <EmptyState icon="📝" title="कोई प्रश्न नहीं" subtitle="ऊपर बटन से जोड़ें।" />
      ) : (
        <div className="question-list">
          {questions.map((q, i) => (
            <div key={q.id} className="question-card">
              <div className="question-card__body">
                <p className="question-card__text"><strong>Q{i + 1}.</strong> {q.question}</p>
                <div className="question-card__options">
                  {q.options.map((opt, j) => (
                    <span key={j} className={`question-card__opt ${j === q.correct ? 'question-card__opt--correct' : ''}`}>
                      {LETTERS[j]}. {opt}{j === q.correct && ' ✓'}
                    </span>
                  ))}
                </div>
              </div>
              <div className="question-card__actions">
                <Button variant="secondary" size="sm" onClick={() => openEdit(q)}>✏️ Edit</Button>
                <Button variant="danger"    size="sm" onClick={() => handleDelete(q.id)}>🗑️</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}
        title={editId ? 'प्रश्न संपादित करें' : 'नया प्रश्न जोड़ें'} maxWidth={560}>
        <div className="form-group">
          <label className="form-label">प्रश्न *</label>
          <textarea className={`form-input form-textarea ${errors.question ? 'form-input--error' : ''}`}
            rows={3} value={form.question}
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            placeholder="प्रश्न यहाँ लिखें..." />
          {errors.question && <p className="form-error">{errors.question}</p>}
        </div>
        {form.options.map((opt, i) => (
          <div key={i} className="form-group">
            <label className="form-label">
              विकल्प {LETTERS[i]} *
              {i === form.correct && <span className="form-label__correct"> ✓ सही उत्तर</span>}
            </label>
            <div className="option-input-row">
              <input className={`form-input ${errors[`opt${i}`] ? 'form-input--error' : ''}`}
                value={opt} onChange={e => setOption(i, e.target.value)} placeholder={`विकल्प ${LETTERS[i]}`} />
              <button type="button"
                className={`correct-toggle ${i === form.correct ? 'correct-toggle--active' : ''}`}
                onClick={() => setForm(f => ({ ...f, correct: i }))} title="सही उत्तर">✓</button>
            </div>
            {errors[`opt${i}`] && <p className="form-error">{errors[`opt${i}`]}</p>}
          </div>
        ))}
        <div className="modal__footer">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>रद्द करें</Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>💾 सहेजें</Button>
        </div>
      </Modal>
    </div>
  );
}
