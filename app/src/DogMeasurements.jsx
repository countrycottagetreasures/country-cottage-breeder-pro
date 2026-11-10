import { useEffect, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const empty = () => ({
  date: new Date().toISOString().slice(0, 10),
  weight: '', height: '', bodyLength: '',
  neck: '', chest: '', weightUnit: 'oz',
  lengthUnit: 'in', notes: ''
});

const fields = [
  ['weight', 'Weight'],
  ['height', 'Height at withers'],
  ['bodyLength', 'Body length (point of shoulder to point of hip)'],
  ['neck', 'Neck circumference'],
  ['chest', 'Chest circumference']
];

export default function DogMeasurements({ user, dog }) {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid || !dog?.id) return;
    return onSnapshot(
      collection(db, 'users', user.uid, 'dogs', dog.id, 'measurements'),
      snap => {
        setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.date.localeCompare(a.date)));
      },
      err => setError(err.message)
    );
  }, [user?.uid, dog?.id]);

  const change = (key, value) =>
    setForm(previous => ({ ...previous, [key]: value }));

  async function save(e) {
    e.preventDefault();
    setError('');
    const values = Object.fromEntries(
      fields.map(([key]) => [
        key, form[key] === '' ? null : Number(form[key])
      ])
    );
    if (!Object.values(values).some(v => v !== null && v > 0)) {
      setError('Enter at least one positive measurement.');
      return;
    }
    if (Object.values(values).some(v => v !== null && (!Number.isFinite(v) || v <= 0))) {
      setError('Measurements must be positive numbers.');
      return;
    }
    const data = {
      ...values, date: form.date,
      weightUnit: form.weightUnit,
      lengthUnit: form.lengthUnit,
      notes: form.notes
    };
    setSaving(true);
    try {
      const ref = collection(db, 'users', user.uid, 'dogs', dog.id, 'measurements');
      if (editing) {
        await updateDoc(doc(ref, editing), data);
      } else {
        await addDoc(ref, data);
      }
      setForm(empty());
      setEditing(null);
      setShowForm(false);
    } catch (err) {
      setError('Could not save measurement: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  function edit(record) {
    setForm({
      ...empty(),
      ...Object.fromEntries(fields.map(([key]) => [
        key, record[key] ?? ''
      ])),
      date: record.date,
      weightUnit: record.weightUnit || 'oz',
      lengthUnit: record.lengthUnit || 'in',
      notes: record.notes || ''
    });
    setEditing(record.id);
    setShowForm(true);
  }

  return (
    <section>
      <h3>Measurements &amp; Growth History</h3>
      <button type="button" onClick={() => {
        setForm(empty()); setEditing(null);
        setShowForm(true); setError('');
      }}>+ Add Measurement</button>

      {showForm && (
        <form onSubmit={save} style={{ padding: 12 }}>
          <h4>{editing ? 'Edit Measurement' : 'New Measurement'}</h4>
          <label>Date
            <input type="date" required value={form.date}
              onChange={e => change('date', e.target.value)} />
          </label>
          <label>Weight Unit
            <select value={form.weightUnit}
              onChange={e => change('weightUnit', e.target.value)}>
              <option value="oz">Ounces</option>
              <option value="lb">Pounds</option>
              <option value="g">Grams</option>
              <option value="kg">Kilograms</option>
            </select>
          </label>
          <label>Length Unit
            <select value={form.lengthUnit}
              onChange={e => change('lengthUnit', e.target.value)}>
              <option value="in">Inches</option>
              <option value="cm">Centimeters</option>
            </select>
          </label>
          {fields.map(([key, label]) => (
            <label key={key} style={{ display: 'block', margin: '10px 0' }}>
              {label}
              <input type="number" min="0" step="any"
                value={form[key]}
                onChange={e => change(key, e.target.value)} />
            </label>
          ))}
          <label>Notes
            <textarea value={form.notes}
              onChange={e => change('notes', e.target.value)} />
          </label>
          <div>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Measurement'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <p role="alert">{error}</p>}
      <h4>Measurement History</h4>
      {records.length === 0 && <p>No measurements recorded yet.</p>}
      {records.map(record => (
        <div key={record.id} style={{
          borderBottom: '1px solid #ccc', padding: 10
        }}>
          <strong>{record.date}</strong>
          {fields.map(([key, label]) => record[key] != null && (
            <p key={key}>{label}: {record[key]} {
              key === 'weight' ? record.weightUnit : record.lengthUnit
            }</p>
          ))}
          {record.notes && <p>Notes: {record.notes}</p>}
          <button type="button" onClick={() => edit(record)}>Edit</button>
        </div>
      ))}
    </section>
  );
}
