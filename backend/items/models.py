from django.conf import settings
from django.db import models


class WorkflowItem(models.Model):
    class Status(models.TextChoices):
        BACKLOG = "Backlog", "Backlog"
        SPRINT_READY = "Sprint Ready", "Sprint Ready"
        IN_PROGRESS = "In Progress", "In Progress"
        CODE_REVIEW = "Code Review", "Code Review"
        QA = "QA", "QA"
        DONE = "Done", "Done"

    class Priority(models.TextChoices):
        LOW = "Low", "Low"
        MEDIUM = "Medium", "Medium"
        HIGH = "High", "High"
        URGENT = "Urgent", "Urgent"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="items"
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.BACKLOG
    )
    priority = models.CharField(
        max_length=10, choices=Priority.choices, default=Priority.MEDIUM
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title