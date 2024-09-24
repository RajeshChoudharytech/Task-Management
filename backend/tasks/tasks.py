# tasks.py (Celery task)
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from celery import shared_task
import time
from .models import Task
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True)
def process_task(self, task_id):
    """
    Process a task, updating it's status in the database and sending
    updates to the channel group "tasks"
    """
    try:
        task = Task.objects.get(id=task_id)
        channel_layer = get_channel_layer()

        # Notify the client that the task is in progress
        logger.info(f"Sending task {task_id} in progress notification")
        async_to_sync(channel_layer.group_send)(
            "tasks",  # Group name
            {
                "type": "task_update",  # This maps to task_update in the consumer
                "task_id": task_id,
                "status": "in_progress",
            },
        )
        task.status = "in_progress"
        task.save()

        # Simulate some processing time
        time.sleep(60)

        # Notify the client that the task is completed
        logger.info(f"Sending task {task_id} completed notification")
        async_to_sync(channel_layer.group_send)(
            "tasks", {"type": "task_update", "task_id": task_id, "status": "completed"}
        )
        task.status = "completed"
        task.save()

    except Exception as e:
        # Notify the client that the task failed
        logger.error(f"Task {task_id} failed", exc_info=True)
        async_to_sync(channel_layer.group_send)(
            "tasks", {"type": "task_update", "task_id": task_id, "status": "failed"}
        )
        task.status = "failed"
        task.save()
        raise (e)
