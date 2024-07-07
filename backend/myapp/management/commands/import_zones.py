import os
import json
import geopandas as gpd
from django.core.management.base import BaseCommand
from myapp.models import Zone

class Command(BaseCommand):
    help = 'Import zones from a GeoJSON file'

    def add_arguments(self, parser):
        parser.add_argument('geojson_file', type=str, help='The path to the GeoJSON file')

    def handle(self, *args, **kwargs):
        geojson_file = kwargs['geojson_file']
        if not os.path.exists(geojson_file):
            self.stdout.write(self.style.ERROR(f'File "{geojson_file}" does not exist'))
            return

        # Read the GeoJSON file
        gdf = gpd.read_file(geojson_file)

        for _, row in gdf.iterrows():
            zone_id = int(row['location_id'])  # Adjust this to match the 'location_id' field in your GeoJSON
            name = row['zone']  # Adjust this to match the 'zone' field in your GeoJSON
            boundary_coordinates = row['geometry'].__geo_interface__  # Use the __geo_interface__ to get GeoJSON representation

            zone, created = Zone.objects.get_or_create(
                id=zone_id,
                defaults={'name': name, 'boundary_coordinates': boundary_coordinates}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Zone "{name}" (ID: {zone_id}) created'))
            else:
                self.stdout.write(self.style.WARNING(f'Zone "{name}" (ID: {zone_id}) already exists'))
