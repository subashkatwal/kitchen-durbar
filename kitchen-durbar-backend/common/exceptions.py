import logging

from cloudinary.exceptions import Error as CloudinaryError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def api_exception_handler(exc, context):
    """
    DRF's default handler, plus image-storage failures. A rejected Cloudinary
    upload (bad credentials, file over the plan's size limit, ...) would
    otherwise surface as a bare 500, leaving the admin panel with nothing
    more useful to show than "something went wrong".
    """
    response = exception_handler(exc, context)
    if response is not None:
        return response

    if isinstance(exc, (CloudinaryError, OSError)):
        logger.exception('Image upload failed')
        return Response(
            {'detail': f'Image upload failed: {exc}'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return None
