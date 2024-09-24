# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer


import logging

logger = logging.getLogger(__name__)

class TaskConsumer(AsyncWebsocketConsumer):
    """
    Consumer that updates the status of tasks in real-time.

    This consumer is used to send updates to the client when the status of a
    task changes.
    """

    async def connect(self):
        """
        Connect to the channel layer group "tasks".

        This method is called when the consumer is connected.
        """
        logger.info("Connecting to channel layer group 'tasks'")
        await self.channel_layer.group_add("tasks", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """
        Disconnect from the channel layer group "tasks".

        This method is called when the consumer is disconnected.
        """
        logger.info("Disconnecting from channel layer group 'tasks'")
        await self.channel_layer.group_discard("tasks", self.channel_name)

    async def task_update(self, event):
        """
        Receive an update from the channel layer group "tasks" and send it to
        the client.

        This method is called when an update is received from the channel
        layer group.
        """
        logger.info(f"Sending update to client: {event}")
        await self.send(text_data=json.dumps(event))
