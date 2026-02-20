from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """Permission class: Admin can do everything, others can only read"""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_admin


class IsAdmin(permissions.BasePermission):
    """Permission class: Only admin can access"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin

