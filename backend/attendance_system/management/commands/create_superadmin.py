from getpass import getpass

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create the initial Smart Attendance superadmin account"

    def handle(self, *args, **options):
        username = input("Username: ").strip()
        name = input("Name: ").strip()
        if not username or not name:
            raise CommandError("Username and name are required.")

        password = getpass("Password: ")
        confirmation = getpass("Password (again): ")
        if not password or password != confirmation:
            raise CommandError("Passwords must be non-empty and match.")

        User = get_user_model()
        if User.objects.filter(username=username).exists():
            raise CommandError("That username is already in use.")

        user = User(
            username=username,
            first_name=name,
            role="SUPERADMIN",
            is_staff=True,
            is_superuser=True,
        )
        user.set_password(password)
        user.save()
        self.stdout.write(self.style.SUCCESS("Superadmin created successfully."))
