from django.db import migrations, models
 
# Only two labels were renamed. "Pending" is new, so no old card maps to it.
RENAMED = {"Sprint Ready": "To Do", "Done": "Completed"}
 
 
def forwards(apps, schema_editor):
    WorkflowItem = apps.get_model("items", "WorkflowItem")
    for old, new in RENAMED.items():
        WorkflowItem.objects.filter(status=old).update(status=new)
 
 
def backwards(apps, schema_editor):
    # Lossy: "Pending" did not exist before, so those cards go back to Backlog.
    WorkflowItem = apps.get_model("items", "WorkflowItem")
    for old, new in RENAMED.items():
        WorkflowItem.objects.filter(status=new).update(status=old)
    WorkflowItem.objects.filter(status="Pending").update(status="Backlog")
 
 
class Migration(migrations.Migration):
    dependencies = [("items", "0001_initial")]
 
    operations = [
        migrations.AlterField(
            model_name="workflowitem",
            name="status",
            field=models.CharField(
                choices=[
                    ("Backlog", "Backlog"),
                    ("To Do", "To Do"),
                    ("Pending", "Pending"),
                    ("In Progress", "In Progress"),
                    ("Code Review", "Code Review"),
                    ("QA", "QA"),
                    ("Completed", "Completed"),
                ],
                default="Backlog",
                max_length=20,
            ),
        ),
        migrations.RunPython(forwards, backwards),
    ]