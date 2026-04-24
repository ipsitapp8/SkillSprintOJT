package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// AdminOnly must be chained AFTER JWTMiddleware.
// It reads the userRole set by JWTMiddleware from the JWT claims
// and aborts with 403 if the user is not an admin.
// This avoids a DB lookup on every admin request.
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("userRole")
		if !exists || role.(string) != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}
		c.Next()
	}
}
