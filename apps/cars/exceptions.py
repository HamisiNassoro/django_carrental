from rest_framework.exceptions import APIException


class CarNotFound(APIException):
    status_code = 404
    deafult_detail = "The requested car does not exist"
