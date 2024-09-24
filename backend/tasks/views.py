from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer
from .tasks import process_task
from rest_framework import viewsets
import logging

logger = logging.getLogger(__name__)


class TaskViewset(viewsets.ViewSet):
    """
    Handles CRUD operations for tasks.
    """

    queryset = []
    serializer_class = TaskSerializer
    lookup_url_kwarg = "id"
    def list(self, request):
        """
        Returns a list of tasks.
        """
        logger.info("Listing tasks")
        self.queryset = Task.objects.all()
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        """
        Creates a new task and schedules it for processing.
        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            task = serializer.save()
            # Schedule the task for processing
            process_task.delay(task.id)
            logger.info(f"Task {task.id} created")
            return Response({"task_id": task.id}, status=201)

        logger.error(f"Failed to create task with data: {request.data}")
        return Response(serializer.errors, status=400)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves the status of a task with the given ID.

        Returns:
            A response containing the status of the task
        """
        logger.info(f"Getting details for task {kwargs[self.lookup_url_kwarg]}")
        task = Task.objects.get(id=kwargs[self.lookup_url_kwarg])
        serializer = self.serializer_class(task)
        return Response(serializer.data)
