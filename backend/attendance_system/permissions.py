from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.role in ("ADMIN", "SUPERADMIN")
        )


class IsSuperAdminRole(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "SUPERADMIN"


class IsSuperAdminRole(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "SUPERADMIN"
        )