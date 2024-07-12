import os
from django.core.management.base import BaseCommand
import gdown

class Command(BaseCommand):
    help = 'Download model file from Google Drive'

    def handle(self, *args, **options):
        file_id = '13rCYf886l9CAwCnxMYkZfe0UO9lXbYtM'
        output_path = os.path.join('model_data_2_0', 'busyness_model.pkl')
        
        print(f'Downloading busyness_model.pkl to: {output_path}')
        gdown.download(f'https://drive.google.com/uc?id={file_id}', output_path, quiet=False)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully downloaded busyness_model.pkl to {output_path}'))
