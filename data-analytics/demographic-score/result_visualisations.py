import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import json
import folium
import branca.colormap as cm
import time

def plot_results(result, metric='average_rank'):
    plt.figure(figsize=(15, 6))
    sns.barplot(x=result['zone_id'], y=result[metric])
    plt.title(f'Distribution of {metric} Across Locations')
    plt.xlabel('zone_id')
    plt.ylabel(f'{metric}')
    plt.xticks(rotation=90)
    plt.ylim(0, 100)
    plt.grid(True)
    plt.show()



def create_color_coded_map(results_df, path_to_geojson, metric, path_to_output_map_file):
    # Load the GeoJSON data containing the taxi zones.
    with open(path_to_geojson) as f:
        geo_data = json.load(f)

    # Convert the relevant columns to string to ensure they match
    results_df['zone_id'] = results_df['zone_id'].astype(str)

    # Extract the features from the GeoJSON data and filter them based on the CSV file
    features = [feature for feature in geo_data['features'] if feature['properties']['location_id'] in results_df['zone_id'].values]

    # Create a DataFrame from the filtered GeoJSON features properties
    gdf = pd.DataFrame([feature['properties'] for feature in features])

    # Ensure that the 'location_id' and 'zone_id' columns are of the same type
    gdf['location_id'] = gdf['location_id'].astype(str)

    # Merge the GeoDataFrame with the busyness scores
    gdf = gdf.merge(results_df, left_on='location_id', right_on='zone_id', how='left')

    # Create a colormap with more steps for a sharper gradient
    min_score = results_df[f'average_{metric}'].min()
    max_score = results_df[f'average_{metric}'].max()
    colormap = cm.LinearColormap(colors=['white', 'red'], vmin=min_score, vmax=max_score).to_step(n=100)

    # Create a folium map centered around New York City
    m = folium.Map(location=[40.7128, -74.0060], zoom_start=12)

    # Function to style the GeoJSON features
    def style_function(feature):
        zone_id = feature['properties']['location_id']
        target_metric = gdf.loc[gdf['location_id'] == zone_id, f'average_{metric}']
        if not target_metric.empty:
            fill_color = colormap(target_metric.values[0])
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

    # save map into an html file
    m.save(path_to_output_map_file)
