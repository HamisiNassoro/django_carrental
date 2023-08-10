from rest_framework.pagination import PageNumberPagination


class CarPagination(PageNumberPagination):
    page_size = 3
