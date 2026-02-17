package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"incident-report-app/backend/internal/model"
	"incident-report-app/backend/internal/service"
)

type IncidentHandler struct {
	svc *service.IncidentService
}

func NewIncidentHandler(s *service.IncidentService) *IncidentHandler {
	return &IncidentHandler{svc: s}
}

func (h *IncidentHandler) Register(r *gin.Engine) {
	r.GET("/incidents", h.List)
	r.GET("/incidents/deleted", h.ListDeleted)
	r.POST("/incidents", h.Create)
	r.PATCH("/incidents/:id", h.Update)
	r.DELETE("/incidents/:id", h.Delete)
	r.POST("/incidents/:id/restore", h.Restore)
	r.POST("/maintenance/purge", h.Purge)
}

func (h *IncidentHandler) List(c *gin.Context) {
	q := c.Query("q")
	status := c.Query("status")
	sortBy := c.DefaultQuery("sortBy", "created_at")
	sortDir := c.DefaultQuery("sortDir", "desc")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	list, err := h.svc.List(c, q, status, sortBy, sortDir, limit, offset)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}

func (h *IncidentHandler) Create(c *gin.Context) {
	var inc model.Incident
	if err := c.BindJSON(&inc); err != nil {
		c.JSON(400, gin.H{"error": "invalid json"})
		return
	}

	res, err := h.svc.Create(c, &inc)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(201, res)
}

func (h *IncidentHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var inc model.Incident
	if err := c.BindJSON(&inc); err != nil {
		c.JSON(400, gin.H{"error": "invalid json"})
		return
	}
	inc.ID = id

	res, err := h.svc.Update(c, &inc)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, res)
}

func (h *IncidentHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	user := c.GetHeader("X-User-Id")
	h.svc.Delete(c, id, user)
	c.Status(204)
}

func (h *IncidentHandler) Restore(c *gin.Context) {
	id := c.Param("id")
	h.svc.Restore(c, id)
	c.Status(204)
}

func (h *IncidentHandler) ListDeleted(c *gin.Context) {
	res, _ := h.svc.ListDeleted(c)
	c.JSON(200, res)
}

func (h *IncidentHandler) Purge(c *gin.Context) {
	h.svc.Purge(c)
	c.Status(204)
}
