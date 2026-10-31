import { useState, useEffect } from 'react';
import { Pencil, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import API       from '../../api/client';
import Button    from '../../components/ui/Button';
import Input     from '../../components/ui/Input';
import Modal     from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import PageTitle  from '../../components/ui/PageTitle';
import styles    from '../admin/List.module.css';

export default function AdminList() {
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { const { data } = await API.get('/superadmin/admin-list/'); setAdmins(data.admins || []); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to load admins'); }
    finally { setLoading(false); }
  }

  async function save() {
    if (!editing.name || !editing.admin_id || !editing.department) {
      toast.error('Name, Admin ID and Department are required'); return;
    }
    setSaving(true);
    try {
      await API.put('/superadmin/update-admin/', editing);
      toast.success('Admin updated');
      setEditing(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  }

  async function remove(id, name) {
    if (!confirm(`Delete ${name} and their login account?`)) return;
    try {
      await API.delete('/superadmin/delete-admin/', { data: { id } });
      toast.success('Admin deleted'); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  }

  return (
    <div className="fade-up">
      <PageTitle
        sub="Manage department administrator accounts"
        action={
          <Button onClick={load} variant="outline" size="sm">
            <RefreshCw size={13} /> Refresh
          </Button>
        }
      >
        Admin List
      </PageTitle>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="spinner" />
        </div>
      )}
      {!loading && admins.length === 0 && <EmptyState message="No admins found." />}
      {!loading && admins.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th><th>Admin ID</th><th>Admin Name</th>
                <th>Department</th><th>Username</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a, i) => (
                <tr key={a.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td className="mono">{a.admin_id}</td>
                  <td style={{ fontWeight: 500 }}>{a.name}</td>
                  <td>{a.department}</td>
                  <td className="text-muted">{a.username}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={[styles.iconBtn, styles.edit].join(' ')}
                        title="Edit" onClick={() => setEditing({ ...a, password: '' })}>
                        <Pencil size={13} />
                      </button>
                      <button className={[styles.iconBtn, styles.del].join(' ')}
                        title="Delete" onClick={() => remove(a.id, a.name)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Admin">
        {editing && (
          <div className={styles.editForm}>
            <Input label="Admin Name" value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <Input label="Admin ID"   value={editing.admin_id}
              onChange={(e) => setEditing({ ...editing, admin_id: e.target.value })} />
            <Input label="Department" value={editing.department}
              onChange={(e) => setEditing({ ...editing, department: e.target.value })} />
            <Input label="New Password" type="password"
              placeholder="Leave blank to keep current password"
              value={editing.password}
              onChange={(e) => setEditing({ ...editing, password: e.target.value })} />
            <div className={styles.modalActions}>
              <Button onClick={save} loading={saving} variant="primary">Save Changes</Button>
              <Button onClick={() => setEditing(null)} variant="outline">Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
