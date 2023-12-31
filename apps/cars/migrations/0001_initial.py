# Generated by Django 3.2.7 on 2023-08-09 09:02

import autoslug.fields
from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import django_countries.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Car',
            fields=[
                ('pkid', models.BigAutoField(editable=False, primary_key=True, serialize=False)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=250, verbose_name='Car Title')),
                ('slug', autoslug.fields.AutoSlugField(always_update=True, editable=False, populate_from='title', unique=True)),
                ('ref_code', models.CharField(blank=True, max_length=255, unique=True, verbose_name='Car Reference Code')),
                ('description', models.TextField(default='Default description...update me please....', verbose_name='Description')),
                ('country', django_countries.fields.CountryField(default='KE', max_length=2, verbose_name='Country')),
                ('city', models.CharField(default='Nairobi', max_length=180, verbose_name='City')),
                ('postal_code', models.CharField(default='140', max_length=100, verbose_name='Postal Code')),
                ('street_address', models.CharField(default='KG8 Avenue', max_length=150, verbose_name='Street Address')),
                ('car_number', models.CharField(max_length=255, unique=True, verbose_name='Car Number Plate')),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=8, verbose_name='Price')),
                ('tax', models.DecimalField(decimal_places=2, default=0.15, help_text='15% car tax charged', max_digits=6, verbose_name='Car Tax')),
                ('total_seats', models.IntegerField(default=0, verbose_name='Number of floors')),
                ('advert_type', models.CharField(choices=[('For Sale', 'For Sale'), ('For Rent', 'For Rent'), ('Auction', 'Auction')], default='For Sale', max_length=50, verbose_name='Advert Type')),
                ('car_type', models.CharField(choices=[('Sedan', 'Sedan'), ('Sports Utility Vehicle(SUV)', 'Sports Utility Vehicle(SUV)'), ('Hatchback', 'Hatchback'), ('Luxury', 'Luxury'), ('Convertible', 'Convertible'), ('Van', 'Van'), ('Electric', 'Electric'), ('Other', 'Other')], default='Other', max_length=50, verbose_name='Car Type')),
                ('cover_photo', models.ImageField(blank=True, default='/car_sample.jpg', null=True, upload_to='', verbose_name='Main Photo')),
                ('photo1', models.ImageField(blank=True, default='/interior_sample.jpg', null=True, upload_to='')),
                ('photo2', models.ImageField(blank=True, default='/interior_sample.jpg', null=True, upload_to='')),
                ('photo3', models.ImageField(blank=True, default='/interior_sample.jpg', null=True, upload_to='')),
                ('photo4', models.ImageField(blank=True, default='/interior_sample.jpg', null=True, upload_to='')),
                ('published_status', models.BooleanField(default=False, verbose_name='Published Status')),
                ('views', models.IntegerField(default=0, verbose_name='Total Views')),
                ('lon', models.FloatField(verbose_name='Longitude')),
                ('lat', models.FloatField(verbose_name='Latitude')),
                ('geom', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='agent_buyer', to=settings.AUTH_USER_MODEL, verbose_name='Agent,renter or Vehicle Provider')),
            ],
            options={
                'verbose_name': 'Car',
                'verbose_name_plural': 'Cars',
            },
        ),
        migrations.CreateModel(
            name='CarViews',
            fields=[
                ('pkid', models.BigAutoField(editable=False, primary_key=True, serialize=False)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('ip', models.CharField(max_length=250, verbose_name='IP Address')),
                ('car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='car_views', to='cars.car')),
            ],
            options={
                'verbose_name': 'Total Views on car',
                'verbose_name_plural': 'Total car Views',
            },
        ),
    ]
