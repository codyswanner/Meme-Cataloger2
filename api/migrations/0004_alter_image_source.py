# Generated by Django 4.2.5 on 2023-11-13 23:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_rename_user_appuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='source',
            field=models.ImageField(max_length=1000, upload_to=''),
        ),
    ]
