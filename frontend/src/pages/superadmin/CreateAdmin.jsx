import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/client';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CredBox from '../../components/ui/CredBox';
import PageTitle from '../../components/ui/PageTitle';
import styles from '../admin/Form.module.css';

export default function CreateAdmin() {
  const [form, setForm] = useState({ name: '', admin_id: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.admin_id.trim() || !form.department.trim()) {
      toast.error('All fields are required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/superadmin/create-admin/', form);
      setCredentials({ ...data.admin, message: data.message });
      setForm({ name: '', admin_id: '', department: '' });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fade-up">
      <PageTitle sub="Create an administrator scoped to one department">
        Create Department Admin
      </PageTitle>
      <div className={styles.grid}>
        <Card>
          <form onSubmit={submit} className={styles.formBody}>
            <Input label="Admin Name" value={form.name}
              onChange={(event) => update('name', event.target.value)} />
            <Input label="Admin ID" value={form.admin_id}
              onChange={(event) => update('admin_id', event.target.value)} />
            <Input label="Department" placeholder="e.g. IT" value={form.department}
              onChange={(event) => update('department', event.target.value)} />
            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
              Create Admin
            </Button>
          </form>
          {credentials && <CredBox {...credentials} />}
        </Card>
      </div>
    </div>
  );
}
