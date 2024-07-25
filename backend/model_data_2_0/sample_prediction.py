import busyness_prediction
import pandas as pd
import folium
import json
import branca.colormap as cm

pred_time = '2024-08-18 18:00:00'
pkl_directory = './busyness_model_percentiles.pkl'

predictions = busyness_prediction.make_prediction(pred_time,pkl_directory)

#if the pickle file is in the same directory as this script, you can just call the function without the path
#predictions = predictss.make_prediction('2024-07-09 18:00:00')

#predictions is a pandas dataframe
print(predictions)


