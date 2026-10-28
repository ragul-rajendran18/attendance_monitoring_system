import { useEffect, useState } from 'react';
import {
  Building2, CalendarCheck, UserCheck, UserX,
  AlertTriangle, Percent, RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/client';
import StatCard from '../../components/ui/StatCard';
import PageTitle from '../../components/ui/PageTitle';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import styles from './Dashboard.module.css';

const STATUS_VARIANT = {
  RECORDED: 'success',
  NOT_RECORDED: 'neutral',
  NO_STUDENTS: 'info',
  INCOMPLETE_DATA: 'warning',
};

const STATUS_LABEL = {
  RECORDED: 'Recorded',
  NOT_RECORDED: 'Not Recorded',
  NO_STUDENTS: 'No Students',
  INCOMPLETE_DATA: 'Incomplete Data',
};

function percentColor(value) {
  if (value === null || value === undefined) return 'var(--border2)';
  if (value >= 75) return 'var(--success)';
  if (value >= 50) return 'var(--warning)';
  return 'var(--danger)';
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchAttendance() {
    const { data: res } = await API.get('/dashboard/super-admin/department-attendance/');
    return res;
  }

  function handleError(error) {
    toast.error(
      error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to load department attendance',
    );
  }

  async function load() {
    setLoading(true);
    try {
      setData(await fetchAttendance());
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAttendance()
      .then(setData)
      .catch(handleError)
      .finally(() => setLoading(false));
  }, []);

  const departments = data?.departments || [];
  const totals = departments.reduce(
    (acc, d) => ({
      sessions: acc.sessions + d.completed_sessions,
      present: acc.present + d.present,
      absent: acc.absent + d.absent,
      unmarked: acc.unmarked + d.unmarked_student_sessions,
    }),
    { sessions: 0, present: 0, absent: 0, unmarked: 0 },
  );

  const recorded = departments.filter((d) => d.attendance_percentage !== null);
  const avgPercentage = recorded.length
    ? Math.round(
        recorded.reduce((sum, d) => sum + d.attendance_percentage, 0) /
          recorded.length,
      )
    : null;

  return (
    <div className="fade-up">
      <PageTitle
        sub="Department-wise attendance recorded today across all departments"
        action={
          <Button onClick={load} loading={loading} variant="outline">
            <RefreshCw size={14} /> Refresh
          </Button>
        }
      >
        Super Admin Dashboard
      </PageTitle>

      <div className={styles.grid}>
        <StatCard
          label="Departments"
          value={data ? departments.length : null}
          icon={Building2}
          accent="#304443"
          iconBg="#EBF1F0"
        />
        <StatCard
          label="Sessions Recorded"
          value={data ? totals.sessions : null}
          icon={CalendarCheck}
          accent="#16A34A"
          iconBg="#F0FDF4"
        />
        <StatCard
          label="Present"
          value={data ? totals.present : null}
          icon={UserCheck}
          accent="#16A34A"
          iconBg="#F0FDF4"
        />
        <StatCard
          label="Absent"
          value={data ? totals.absent : null}
          icon={UserX}
          accent="#DC2626"
          iconBg="#FEF2F2"
        />
        <StatCard
          label="Unmarked"
          value={data ? totals.unmarked : null}
          icon={AlertTriangle}
          accent="#D97706"
          iconBg="#FFFBEB"
        />
        <StatCard
          label="Avg Attendance"
          value={data ? (avgPercentage === null ? '—' : `${avgPercentage}%`) : null}
          icon={Percent}
          accent="#46615F"
          iconBg="#EEF3F2"
        />
      </div>

      {data && (
        <p className={styles.dateLine}>
          Attendance date: <span className="mono">{data.date}</span>
        </p>
      )}

      {!data && !loading && (
        <EmptyState
          message="No attendance data available."
          sub="Department statistics will appear here once sessions are completed."
        />
      )}

      {data && departments.length === 0 && (
        <EmptyState
          message="No departments found."
          sub="Create a department admin to start tracking attendance."
        />
      )}

      {departments.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Department</th>
                <th>Sessions</th>
                <th>Expected</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Unmarked</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.department}>
                  <td style={{ fontWeight: 500 }}>{d.department}</td>
                  <td>{d.completed_sessions}</td>
                  <td>{d.expected_student_sessions}</td>
                  <td className="text-success">{d.present}</td>
                  <td className="text-danger">{d.absent}</td>
                  <td className={d.unmarked_student_sessions ? 'text-warning' : 'text-muted'}>
                    {d.unmarked_student_sessions}
                  </td>
                  <td>
                    {d.attendance_percentage === null ? (
                      <span className="text-muted">—</span>
                    ) : (
                      <div className={styles.percentCell}>
                        <span className={styles.percentValue}>
                          {d.attendance_percentage}%
                        </span>
                        <span className={styles.bar}>
                          <span
                            className={styles.barFill}
                            style={{
                              width: `${d.attendance_percentage}%`,
                              background: percentColor(d.attendance_percentage),
                            }}
                          />
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <Badge
                      label={STATUS_LABEL[d.status] || d.status}
                      variant={STATUS_VARIANT[d.status] || 'neutral'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
