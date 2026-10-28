7# Smart Attendance System

## Local PostgreSQL setup

The Django application connects to PostgreSQL on `localhost:5432` by default
and uses the `attendancesystem` database. Configure credentials with environment
variables; for the local credentials requested for this setup, set
`POSTGRES_USER=postgres` and `POSTGRES_PASSWORD=ragul1810`. Optional settings
are `POSTGRES_HOST`, `POSTGRES_PORT`, and `POSTGRES_DB`.

Install Python dependencies, run database migrations, and create the initial
superadmin:

```powershell
$env:POSTGRES_USER = "postgres"
$env:POSTGRES_PASSWORD = "ragul1810"
pip install -r requirements.txt
python manage.py migrate
python manage.py create_superadmin
```

Sign in as the superadmin and use **Create Admin** to create department
administrators. Department admins create staff, students, and subjects within
their assigned department. Subject records are associated with a year (for
example, `II`); staff choose their section (for example, `II IT A`) when
starting attendance, then choose from that year's subjects.
