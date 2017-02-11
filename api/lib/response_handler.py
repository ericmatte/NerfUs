import traceback

from flask import Response
from flask import json


class HttpResponse(Response):
    """Standardized HTTP API response for the flask application.

    Args:
        response (str or dict): The response to return.
                                Response can be format into 'text/plain' or 'application/json'.
                                For errors codes (>=400), response will be text/plain.
        status (int, optional): Status code.

    @See werkzeug.http.HTTP_STATUS_CODES for full list of status codes.
    """

    def __init__(self, description=None, response={}, status=200):
        if status < 400:
            mime_type = 'application/json'
            # Put str type of response into a simple dict
            response['description'] = description
        else:
            mime_type = 'text/plain'
            response = description

        response = json.dumps(response) if type(response) is dict else response

        super().__init__(response, status=status, mimetype=mime_type)


class HttpErrorResponse(HttpResponse):
    """Standardized HTTP API error response.
    Will generate a response, but also print the error into log.
    An HttpErrorResponse should be place in the catch section of a try.

    Args:
        response (str or dict): The response to return.
                                Response can be format into 'text/plain' or 'application/json'.
                                For errors codes (>=400), response will be text/plain.
        status (int, optional): Status code.

    @See werkzeug.http.HTTP_STATUS_CODES for full list of status codes.
    """

    def __init__(self, exception, response=None, status=200):
        # Logging error
        template = "An exception of type {0} occurred. Arguments: {1!r}"
        if response is not None:
            print(str(response) + ":")
        print(template.format(type(exception).__name__, exception.args))
        traceback.print_tb(exception.__traceback__)

        super().__init__(response, status=status)
