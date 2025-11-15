"""
Custom middleware for Render deployment.
Allows all hosts ending with .onrender.com to handle dynamic hostnames.
"""
from django.http import HttpRequest
from django.utils.deprecation import MiddlewareMixin


class RenderHostMiddleware(MiddlewareMixin):
    """
    Middleware to allow all Render subdomains (*.onrender.com).
    This is needed because Render assigns dynamic hostnames with random suffixes.
    This middleware must be placed before SecurityMiddleware to modify ALLOWED_HOSTS
    before Django's host validation occurs.
    """
    def process_request(self, request: HttpRequest):
        # Extract host from HTTP_HOST header directly (before Django validates it)
        host_header = request.META.get('HTTP_HOST', '')
        if not host_header:
            return None
        
        # Remove port if present
        host = host_header.split(':')[0]
        
        # If host ends with .onrender.com, add it to ALLOWED_HOSTS
        if host.endswith('.onrender.com'):
            from django.conf import settings
            # Convert to list if needed and add the host
            if not isinstance(settings.ALLOWED_HOSTS, list):
                settings.ALLOWED_HOSTS = list(settings.ALLOWED_HOSTS)
            if host not in settings.ALLOWED_HOSTS:
                settings.ALLOWED_HOSTS.append(host)
        
        return None

