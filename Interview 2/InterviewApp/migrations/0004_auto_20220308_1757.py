# Generated by Django 3.2.11 on 2022-03-08 17:57

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('InterviewApp', '0003_auto_20220301_0917'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='registrationtbl',
            name='member_of',
        ),
        migrations.AlterField(
            model_name='plantable',
            name='created',
            field=models.DateField(default=datetime.datetime(2022, 3, 8, 17, 57, 30, 657991)),
        ),
        migrations.AlterField(
            model_name='registrationtbl',
            name='registered_at',
            field=models.DateField(default=datetime.datetime(2022, 3, 8, 17, 57, 30, 695566)),
        ),
        migrations.AlterField(
            model_name='talenstsumofolder',
            name='created',
            field=models.DateField(default=datetime.datetime(2022, 3, 8, 17, 57, 30, 697182)),
        ),
        migrations.AlterField(
            model_name='talenstsumotemplates',
            name='created',
            field=models.DateField(default=datetime.datetime(2022, 3, 8, 17, 57, 30, 697734)),
        ),
        migrations.CreateModel(
            name='MemberMapping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateField(default=datetime.datetime(2022, 3, 8, 17, 57, 30, 696456))),
                ('member_of', models.ForeignKey(blank=True, default=None, max_length=800, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='member_of', to='InterviewApp.registrationtbl')),
                ('user', models.ForeignKey(blank=True, default=None, max_length=800, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user', to='InterviewApp.registrationtbl')),
            ],
            options={
                'verbose_name': 'Member Mapping',
                'verbose_name_plural': 'Members Mapping',
            },
        ),
    ]
