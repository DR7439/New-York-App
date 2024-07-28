import pickle
import pandas as pd

#make sure to name the target variable in your model as "busyness_score".

features = [
    'hour_sin', 'hour_cos', 'day_sin', 'day_cos', 'weekday_sin', 'weekday_cos', 'month_sin', 'month_cos', 'week_sin', 'week_cos', 'year_sin', 'year_cos',
    'is_weekend', 'is_rush_hour', 'zone_area_km2', 'subway_station_present',
    'rolling_mean_24h', 'rolling_std_24h', 'rolling_mean_7d', 'rolling_std_7d',
    'lag_1h', 'lag_24h', 'lag_7d'
]



zones_df = pd.read_csv('./zones_df.csv')
historical_rolling_features_df = pd.read_csv("./historical_rolling_features_df.csv")

#pickle the model and include the zones_df and historical data into it
data = {
    'pipeline': pipeline,
    'zones_df': zones_df,
    'historical_rolling_features_df': historical_rolling_features_df
}

with open('busyness_model_percentiles.pkl', 'wb') as f:
    pickle.dump(data, f)
