package service

import (
	"context"
	"strings"

	"incident-report-app/backend/internal/model"
	"incident-report-app/backend/internal/repository"
	"incident-report-app/backend/internal/utils"
)

type IncidentService struct {
	repo *repository.IncidentRepository
}

func NewIncidentService(r *repository.IncidentRepository) *IncidentService {
	return &IncidentService{repo: r}
}

func (s *IncidentService) Create(ctx context.Context, inc *model.Incident) (*model.Incident, error) {
	if strings.TrimSpace(inc.Status) == "" {
		inc.Status = "open"
	}
	return s.repo.Create(ctx, inc)
}

func (s *IncidentService) List(ctx context.Context, q, status, sortBy, sortDir string, limit, offset int) ([]model.Incident, error) {
	sortBy = normalizeSortBy(sortBy)
	sortDir = normalizeSortDir(sortDir)
	limit = utils.NormalizeLimit(limit)
	if offset < 0 {
		offset = 0
	}
	return s.repo.List(ctx, q, status, sortBy, sortDir, limit, offset)
}

func (s *IncidentService) Update(ctx context.Context, inc *model.Incident) (*model.Incident, error) {
	return s.repo.Update(ctx, inc)
}

func (s *IncidentService) Delete(ctx context.Context, id, user string) error {
	if strings.TrimSpace(user) == "" {
		user = "unknown"
	}
	return s.repo.SoftDelete(ctx, id, user)
}

func (s *IncidentService) Restore(ctx context.Context, id string) error {
	return s.repo.Restore(ctx, id)
}

func (s *IncidentService) ListDeleted(ctx context.Context) ([]model.Incident, error) {
	return s.repo.ListDeleted(ctx)
}

func (s *IncidentService) Purge(ctx context.Context) error {
	return s.repo.Purge(ctx)
}

func normalizeSortBy(v string) string {
	switch v {
	case "created_at", "updated_at":
		return v
	default:
		return "created_at"
	}
}
func normalizeSortDir(v string) string {
	v = strings.ToLower(v)
	if v == "asc" || v == "desc" {
		return v
	}
	return "desc"
}
