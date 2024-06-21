from celery import shared_task
# from .models import Search, Busyness, Demographic, Zone
# import pickle
# import datetime

@shared_task
def background_task(search_id):
    print('Running background task. Seacrching for search_id:', search_id)
    print(search_id)
    # search = Search.objects.get(id=search_id)
    
    # # Load your pickle model files
    # with open('busyness_model.pkl', 'rb') as f:
    #     busyness_model = pickle.load(f)
    
    # with open('demographic_model.pkl', 'rb') as f:
    #     demographic_model = pickle.load(f)
    
    # # Generate predictions and populate tables
    # search_datetime = datetime.datetime.combine(search.date_search_made_on, datetime.time.min)
    # zones = Zone.objects.all()  # Assuming predictions need to be made for all zones
    # for zone in zones:
    #     for minute in range(0, 1440, 15):  # Every 15 minutes
    #         dt = search_datetime + datetime.timedelta(minutes=minute)
    #         # Example prediction using the models (adjust as needed)
    #         busyness_score = busyness_model.predict([[dt, zone.zone_id]])
    #         demographic_score = demographic_model.predict([[dt, zone.zone_id, search.id]])
            
    #         # Populate the Busyness table
    #         if not Busyness.objects.filter(datetime=dt, zone=zone).exists():
    #             Busyness.objects.create(datetime=dt, zone=zone, busyness_score=busyness_score)
            
    #         # Populate the Demographic table
    #         Demographic.objects.create(datetime=dt, zone=zone, search=search, score=demographic_score)
