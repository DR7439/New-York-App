import pandas as pd
from dateutil.relativedelta import relativedelta
from datetime import timedelta
import numpy as np
import pickle


def get_last_12_months_rows(df, timestamp, zone_id):
    current_time = pd.to_datetime(timestamp)
    
    max_timestamp = df['transit_timestamp'].max()
    
    result_rows = []
    
    # Loop over the past 12 months
    for i in range(1, 13):
        # Calculate the datetime for the same day and time in the previous months
        prev_time = current_time - relativedelta(months=i)
        
        # Adjust day if the month doesn't have the exact day (e.g., February 30 -> February 28/29)
        if prev_time.month != (current_time - relativedelta(months=i)).month:
            prev_time = prev_time.replace(day=1) - timedelta(days=1)
            prev_time = prev_time.replace(hour=current_time.hour, minute=current_time.minute, second=current_time.second)
        
        # Find the closest previous timestamp within the available range if the exact timestamp does not exist
        while prev_time > max_timestamp:
            prev_time = prev_time - relativedelta(years=1)
        
        # Get rows corresponding to the previous timestamp and zone_id
        rows = df[(df['transit_timestamp'] == prev_time) & (df['zone_id'] == zone_id)]
        result_rows.append(rows)
    
    # Concatenate all results into a single dataframe
    result_df = pd.concat(result_rows, ignore_index=True)
    
    return result_df

def load_pickle(file_path = 'xgboost_busyness_model.pkl'):
    with open(file_path, 'rb') as f:
        loaded_data = pickle.load(f)
        return loaded_data


def make_prediction(pred_time, path_to_pickle='model_data_2_0/busyness_model.pkl'):
    '''
    This function returns a pandas dataframe with the predictions for the specified time for all taxi zones.
    samepl pred_time = '2024-07-09 08:00:00'
    '''

    # Load the model from a pickle file
    #the part below can be optimised by loading the pickle file only once and then using the loaded data to make predictions
    #👇👇👇👇
    loaded_data = load_pickle(path_to_pickle)
    pipeline = loaded_data['pipeline']
    zones_df = loaded_data['zones_df']
    historical_rolling_features_df = loaded_data['historical_rolling_features_df']
    historical_rolling_features_df['transit_timestamp'] = pd.to_datetime(historical_rolling_features_df['transit_timestamp'])
    #👆👆👆👆

    pred_time_dt = pd.to_datetime(pred_time)

    zones = zones_df['zone_id'].tolist()

    hour = pred_time_dt.hour
    day = pred_time_dt.day
    weekday = pred_time_dt.weekday()

    month = pred_time_dt.month
    year = pred_time_dt.year
    week = pred_time_dt.isocalendar().week
    is_weekend = weekday >= 5
    is_rush_hour = hour in [7, 8, 9, 16, 17, 18, 19] and not is_weekend

    # Create cyclic features for hour, month, week, and year
    min_year = 2022
    max_year = max(2024,pred_time_dt.year)

    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)
    day_sin = np.sin(2 * np.pi * day / 31)
    day_cos = np.cos(2 * np.pi * day / 31)
    weekday_sin = np.sin(2 * np.pi * weekday / 7)
    weekday_cos = np.cos(2 * np.pi * weekday / 7)
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)
    week_sin = np.sin(2 * np.pi * week / 52)
    week_cos = np.cos(2 * np.pi * week / 52)
    year_sin = np.sin(2 * np.pi * (year - min_year) / (max_year - min_year + 1))
    year_cos = np.cos(2 * np.pi * (year - min_year) / (max_year - min_year + 1))

    features = [
        'hour_sin', 'hour_cos', 'day_sin', 'day_cos', 'weekday_sin', 'weekday_cos', 'month_sin', 'month_cos', 'week_sin', 'week_cos', 'year_sin', 'year_cos',
        'is_weekend', 'is_rush_hour', 'zone_area_km2', 'subway_station_present',
        'log_rolling_mean_24h', 'log_rolling_std_24h', 'log_rolling_mean_7d', 'log_rolling_std_7d',
        'log_lag_1h', 'log_lag_24h', 'log_lag_7d'
    ]

    rolling_and_lag_features = ['rolling_mean_24h', 'rolling_std_24h', 'rolling_mean_7d',
    'rolling_std_7d', 'lag_1h', 'lag_24h', 'lag_7d', 'log_rolling_mean_24h',
    'log_rolling_std_24h', 'log_rolling_mean_7d', 'log_rolling_std_7d',
    'log_lag_1h', 'log_lag_24h', 'log_lag_7d']

    results = []

    for zone in zones:
        X = get_last_12_months_rows(historical_rolling_features_df, pred_time, zone)[rolling_and_lag_features].mean().to_frame().T
        X['hour'] = hour
        X['day'] = day
        X['weekday'] = weekday
        X['month'] = month
        X['year'] = year
        X['week'] = week
        X['is_weekend'] = is_weekend
        X['is_rush_hour'] = is_rush_hour
        X['hour_sin'] = hour_sin
        X['hour_cos'] = hour_cos
        X['day_sin'] = day_sin
        X['day_cos'] = day_cos
        X['weekday_sin'] = weekday_sin
        X['weekday_cos'] = weekday_cos
        X['month_sin'] = month_sin
        X['month_cos'] = month_cos
        X['week_sin'] = week_sin
        X['week_cos'] = week_cos
        X['year_sin'] = year_sin
        X['year_cos'] = year_cos
        X['zone_id'] = zone
        X['zone_area_km2'] = zones_df[zones_df['zone_id'] == zone]['zone_area_km2'].iloc[0]
        X['subway_station_present'] = zones_df[zones_df['zone_id'] == zone]['subway_station_present'].iloc[0]
        X = X[features + ['zone_id']]
        X_transformed = pipeline.named_steps['preprocessor'].transform(X)
        y_pred = pipeline.named_steps['model'].predict(X_transformed)
        res = {
            'timestamp': pred_time,
            'zone_id': zone,
            'predicted_log_busyness_score': y_pred[0],
            'predicted_busyness_score': np.expm1(y_pred[0])
        }
        results.append(res)

    results_df = pd.DataFrame(results)

    return results_df

