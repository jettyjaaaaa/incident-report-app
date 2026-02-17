package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"incident-report-app/backend/internal/model"
)

type IncidentRepository struct {
	db *pgxpool.Pool
}

func NewIncidentRepository(db *pgxpool.Pool) *IncidentRepository {
	return &IncidentRepository{db: db}
}

func (r *IncidentRepository) Create(ctx context.Context, inc *model.Incident) (*model.Incident, error) {
	sql := `
	insert into incidents(title, description, category, status, created_by)
	values ($1,$2,$3,$4,$5)
	returning id, title, description, category, status, created_by, created_at, updated_at, deleted_at;
	`

	err := r.db.QueryRow(ctx, sql,
		inc.Title, inc.Description, inc.Category, inc.Status, inc.CreatedBy,
	).Scan(
		&inc.ID, &inc.Title, &inc.Description, &inc.Category, &inc.Status,
		&inc.CreatedBy, &inc.CreatedAt, &inc.UpdatedAt, &inc.DeletedAt,
	)

	return inc, err
}

func (r *IncidentRepository) List(ctx context.Context, q, status, sortBy, sortDir string, limit, offset int) ([]model.Incident, error) {
	args := []any{}
	where := "deleted_at is null"

	if status != "" {
		args = append(args, status)
		where += fmt.Sprintf(" and status=$%d", len(args))
	}
	if q != "" {
		args = append(args, "%"+q+"%")
		where += fmt.Sprintf(" and (title ilike $%d or description ilike $%d)", len(args), len(args))
	}

	sql := fmt.Sprintf(`
	select id, title, description, category, status, created_by, created_at, updated_at, deleted_at
	from incidents
	where %s
	order by %s %s
	limit %d offset %d
	`, where, sortBy, sortDir, limit, offset)

	rows, err := r.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []model.Incident
	for rows.Next() {
		var i model.Incident
		err := rows.Scan(&i.ID, &i.Title, &i.Description, &i.Category, &i.Status,
			&i.CreatedBy, &i.CreatedAt, &i.UpdatedAt, &i.DeletedAt)
		if err != nil {
			return nil, err
		}
		list = append(list, i)
	}
	return list, nil
}

func (r *IncidentRepository) Update(ctx context.Context, inc *model.Incident) (*model.Incident, error) {
	sql := `
	update incidents
	set title=$1, description=$2, category=$3, status=$4
	where id=$5 and deleted_at is null
	returning id, title, description, category, status, created_by, created_at, updated_at, deleted_at;
	`

	err := r.db.QueryRow(ctx, sql,
		inc.Title, inc.Description, inc.Category, inc.Status, inc.ID,
	).Scan(&inc.ID, &inc.Title, &inc.Description, &inc.Category,
		&inc.Status, &inc.CreatedBy, &inc.CreatedAt, &inc.UpdatedAt, &inc.DeletedAt)

	return inc, err
}

func (r *IncidentRepository) SoftDelete(ctx context.Context, id, user string) error {
	_, err := r.db.Exec(ctx,
		`update incidents set deleted_at=now(), deleted_by=$1 where id=$2 and deleted_at is null`,
		user, id)
	return err
}

func (r *IncidentRepository) Restore(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx,
		`update incidents set deleted_at=null, deleted_by=null where id=$1`,
		id)
	return err
}

func (r *IncidentRepository) ListDeleted(ctx context.Context) ([]model.Incident, error) {
	rows, err := r.db.Query(ctx, `
	select id, title, description, category, status, created_by, created_at, updated_at, deleted_at
	from incidents
	where deleted_at is not null
	order by deleted_at desc
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []model.Incident
	for rows.Next() {
		var i model.Incident
		rows.Scan(&i.ID, &i.Title, &i.Description, &i.Category,
			&i.Status, &i.CreatedBy, &i.CreatedAt, &i.UpdatedAt, &i.DeletedAt)
		list = append(list, i)
	}
	return list, nil
}

func (r *IncidentRepository) Purge(ctx context.Context) error {
	_, err := r.db.Exec(ctx,
		`delete from incidents where deleted_at < now() - interval '1 month'`)
	return err
}
