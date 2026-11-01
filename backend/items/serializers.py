import re

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import WorkflowItem


class WorkflowItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowItem
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_email(self, value):
        # Emails must be unique, ignoring upper/lower case (A@x.com is the same as a@x.com).
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def validate_password(self, value):
        missing = []
        if len(value) < 8:
            missing.append("at least 8 characters")
        if not re.search(r"[a-z]", value):
            missing.append("a lowercase letter")
        if not re.search(r"[A-Z]", value):
            missing.append("an uppercase letter")
        if not re.search(r"[0-9]", value):
            missing.append("a number")
        if not re.search(r"[^A-Za-z0-9\s]", value):
            missing.append("a special character")
        if missing:
            raise serializers.ValidationError("Password needs " + ", ".join(missing) + ".")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)