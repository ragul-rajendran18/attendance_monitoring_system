import { useState } from 'react';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';
import API      from '../../api/client';
import Card     from '../../components/ui/Card';
import Input    from '../../components/ui/Input';
import Button   from '../../components/ui/Button';
import PageTitle from '../../components/ui/PageTitle';
import styles   from './Form.module.css';

export default function CreateSubject() {
  const [form, setForm] = useState({ subject_code: '', subject_name: '', year: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.subject_code || !form.subject_name || !form.year) {
      toast.error('All fields are required'); return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/create-subject/', form);
      setResult(data.subject);
      setForm({ subject_code: '', subject_name: '', year: '' });
      toast.success('Subject created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create subject');
    } finally { setLoading(false); }
  }

  return (
    <div className="fade-up">
      <PageTitle sub="Add a subject to a department year">Create Subject</PageTitle>
      <div className={styles.grid}>
        <Card>
          <form onSubmit={submit} className={styles.formBody}>
            <Input label="Subject Code" placeholder="e.g. CS301"
              value={form.subject_code} onChange={(e) => set('subject_code', e.target.value)} />
            <Input label="Subject Name" placeholder="e.g. Database Systems"
              value={form.subject_name} onChange={(e) => set('subject_name', e.target.value)} />
            <Input label="Year" placeholder="e.g. II"
              value={form.year} onChange={(e) => set('year', e.target.value)} />
            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
              Create Subject
            </Button>
          </form>
          {result && (
            <div className={styles.resultFlash}>
              {result.subject_code} &nbsp;·&nbsp; {result.subject_name} &nbsp;·&nbsp; Year {result.year}
            </div>
          )}
        </Card>

        <Card flat>
          <div className={styles.helpHead}><Info size={14} className={styles.helpIcon} />Class subjects</div>
          <p className={styles.helpText}>Subjects are assigned to your department automatically. Staff select their section (e.g. <strong>II IT A</strong>) and see all subjects for that year.</p>
        </Card>
      </div>
    </div>
  );
}
