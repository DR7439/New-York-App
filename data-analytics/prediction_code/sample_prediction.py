import busyness_prediction
import pandas as pd
import folium
import json
import branca.colormap as cm

pred_time = '2025-03-18 18:00:00'
pkl_directory = './busyness_model.pkl'

predictions = busyness_prediction.make_prediction(pred_time,pkl_directory)

#if the pickle file is in the same directory as this script, you can just call the function without the path
#predictions = predictss.make_prediction('2024-07-09 18:00:00')

#predictions is a pandas dataframe
print(predictions)

# Load the GeoJSON data containing the taxi zones.
with open('./NYC Taxi Zones.geojson') as f:
    geo_data = json.load(f)

busyness_df = predictions.copy()

# Convert the relevant columns to string to ensure they match
busyness_df['zone_id'] = busyness_df['zone_id'].astype(str)

# Extract the features from the GeoJSON data and filter them based on the CSV file
features = [feature for feature in geo_data['features'] if feature['properties']['location_id'] in busyness_df['zone_id'].values]

# Create a DataFrame from the filtered GeoJSON features properties
gdf = pd.DataFrame([feature['properties'] for feature in features])

# Ensure that the 'location_id' and 'zone_id' columns are of the same type
gdf['location_id'] = gdf['location_id'].astype(str)

# Merge the GeoDataFrame with the busyness scores
gdf = gdf.merge(busyness_df, left_on='location_id', right_on='zone_id', how='left')

# Create a colormap with more steps for a sharper gradient
min_score = busyness_df['predicted_busyness_score'].min()
max_score = busyness_df['predicted_busyness_score'].max()
colormap = cm.LinearColormap(colors=['white', 'red'], vmin=min_score, vmax=max_score).to_step(n=100)

# Create a folium map centered around New York City
m = folium.Map(location=[40.7128, -74.0060], zoom_start=12)

# Function to style the GeoJSON features
def style_function(feature):
    zone_id = feature['properties']['location_id']
    busyness_score = gdf.loc[gdf['location_id'] == zone_id, 'predicted_busyness_score']
    if not busyness_score.empty:
        fill_color = colormap(busyness_score.values[0])
    else:
        fill_color = 'grey'
    return {
        'fillOpacity': 0.7,
        'weight': 0.5,
        'fillColor': fill_color
    }


# Add the filtered GeoJSON data to the map with style and popups
folium.GeoJson(
    {"type": "FeatureCollection", "features": features},
    style_function=style_function,
    tooltip=folium.GeoJsonTooltip(fields=['location_id']),
    popup=folium.GeoJsonPopup(fields=['location_id'], aliases=['Zone ID:'])
).add_to(m)

# Add colormap to the map
colormap.add_to(m)

pred_time = pred_time.replace(':','')
pred_time = pred_time.rstrip('0')

# save map into an html file
m.save(f'busyness_map_{pred_time}.html')
