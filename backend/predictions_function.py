import pandas as pd
import numpy as np
import pickle

def make_predictions(prediction_time, path_to_zones_csv='./model_data/zones_df.csv', path_to_latest_historical_data_csv='./model_data/latest_historical_data.csv', path_to_pickle_file='./model_data/xgboost_busyness_model.pkl'):
    # Load the model from pickle file
    with open(path_to_pickle_file, 'rb') as f:
        pipeline = pickle.load(f)

    # Read zones data and latest historical data
    zones_df = pd.read_csv(path_to_zones_csv)
    latest_data = pd.read_csv(path_to_latest_historical_data_csv)

    # Define the date for prediction
    start_date = pd.Timestamp('2024-04-01 00:00:00') # last time recorded in the dataset.
    end_date = pd.Timestamp(prediction_time) # the time when we are interested to make a prediction.

    # This is the range of timestamps for which the model will be run.
    date_range = pd.date_range(start=start_date + pd.Timedelta(hours=1), end=end_date, freq='H')

    # Return the zone_ids from zones_df and save them in a list
    zones = zones_df['zone_id'].tolist()

    # Construct the time and zone columns and add them to the future_df
    future_df = pd.DataFrame([(zone, date) for zone in zones for date in date_range], columns=['zone_id', 'transit_timestamp'])

    # Merge the zones_df to include subway_station_present in future_df
    future_df = future_df.merge(zones_df, on='zone_id', how='left')

    # Create time-based features for the future dates
    future_df['hour'] = future_df['transit_timestamp'].dt.hour
    future_df['day'] = future_df['transit_timestamp'].dt.day
    future_df['weekday'] = future_df['transit_timestamp'].dt.weekday
    future_df['month'] = future_df['transit_timestamp'].dt.month
    future_df['year'] = future_df['transit_timestamp'].dt.year
    future_df['week'] = future_df['transit_timestamp'].dt.isocalendar().week
    future_df['is_weekend'] = future_df['weekday'] >= 5
    future_df['is_rush_hour'] = future_df['hour'].isin([7, 8, 9, 16, 17, 18, 19]) & ~future_df['is_weekend']

    # Create cyclic features for hour, month, week, and year
    min_year = 2022
    max_year = max(2024, end_date.year)

    future_df['hour_sin'] = np.sin(2 * np.pi * future_df['hour'] / 24)
    future_df['hour_cos'] = np.cos(2 * np.pi * future_df['hour'] / 24)
    future_df['day_sin'] = np.sin(2 * np.pi * future_df['day'] / 31)
    future_df['day_cos'] = np.cos(2 * np.pi * future_df['day'] / 31)
    future_df['weekday_sin'] = np.sin(2 * np.pi * future_df['weekday'] / 7)
    future_df['weekday_cos'] = np.cos(2 * np.pi * future_df['weekday'] / 7)
    future_df['month_sin'] = np.sin(2 * np.pi * future_df['month'] / 12)
    future_df['month_cos'] = np.cos(2 * np.pi * future_df['month'] / 12)
    future_df['week_sin'] = np.sin(2 * np.pi * future_df['week'] / 52)
    future_df['week_cos'] = np.cos(2 * np.pi * future_df['week'] / 52)
    future_df['year_sin'] = np.sin(2 * np.pi * (future_df['year'] - min_year) / (max_year - min_year + 1))
    future_df['year_cos'] = np.cos(2 * np.pi * (future_df['year'] - min_year) / (max_year - min_year + 1))

    # Initialize columns for rolling and lagged features
    rolling_features = ['rolling_mean_24h', 'rolling_std_24h', 'rolling_mean_7d', 'rolling_std_7d']
    lagged_features = ['lag_1h', 'lag_24h', 'lag_7d']
    log_features = ['log_' + feat for feat in rolling_features + lagged_features]

    # Fill the values with NaN initially.
    for feat in rolling_features + lagged_features + log_features:
        future_df[feat] = np.nan

    # Prepend latest_data to future_df
    latest_data['transit_timestamp'] = pd.to_datetime(latest_data['transit_timestamp'])
    combined_df = pd.concat([latest_data, future_df], ignore_index=True)

    # Sort by 'transit_timestamp' to ensure correct order
    combined_df = combined_df.sort_values(by='transit_timestamp').reset_index(drop=True)

    # Drop unnecessary columns if they exist
    columns_to_drop = ['total_ridership', 'subway_ridership', 'taxi_ridership', 'log_taxi_ridership', 'log_subway_ridership', 'log_zone_area_km2', 'busyness_score']
    combined_df.drop(columns=[col for col in columns_to_drop if col in combined_df.columns], inplace=True)

    features = [
        'hour_sin', 'hour_cos', 'day_sin', 'day_cos', 'weekday_sin', 'weekday_cos', 'month_sin', 'month_cos', 'week_sin', 'week_cos', 'year_sin', 'year_cos',
        'is_weekend', 'is_rush_hour', 'zone_area_km2', 'subway_station_present',
        'log_rolling_mean_24h', 'log_rolling_std_24h', 'log_rolling_mean_7d', 'log_rolling_std_7d',
        'log_lag_1h', 'log_lag_24h', 'log_lag_7d'
    ]

    future_df = combined_df.copy()

    # Iterate through the date range and fill missing data
    for date in date_range:
        for zone in zones:
            zone_df = future_df[(future_df['zone_id'] == zone) & (future_df['transit_timestamp'] <= date)]
            current_idx = (future_df['zone_id'] == zone) & (future_df['transit_timestamp'] == date)
            # Update rolling and lagged features
            future_df.loc[current_idx, 'rolling_mean_24h'] = zone_df['log_busyness_score'].shift(1).rolling(window=24).mean().iloc[-1]
            future_df.loc[current_idx, 'rolling_std_24h'] = zone_df['log_busyness_score'].shift(1).rolling(window=24).std().iloc[-1]
            future_df.loc[current_idx, 'rolling_mean_7d'] = zone_df['log_busyness_score'].shift(1).rolling(window=24*7).mean().iloc[-1]
            future_df.loc[current_idx, 'rolling_std_7d'] = zone_df['log_busyness_score'].shift(1).rolling(window=24*7).std().iloc[-1]
            future_df.loc[current_idx, 'lag_1h'] = zone_df['log_busyness_score'].shift(1).iloc[-1]
            future_df.loc[current_idx, 'lag_24h'] = zone_df['log_busyness_score'].shift(24).iloc[-1]
            future_df.loc[current_idx, 'lag_7d'] = zone_df['log_busyness_score'].shift(24*7).iloc[-1]

            # Apply log transformation
            future_df.loc[current_idx, 'log_rolling_mean_24h'] = np.log1p(future_df.loc[current_idx, 'rolling_mean_24h'])
            future_df.loc[current_idx, 'log_rolling_std_24h'] = np.log1p(future_df.loc[current_idx, 'rolling_std_24h'])
            future_df.loc[current_idx, 'log_rolling_mean_7d'] = np.log1p(future_df.loc[current_idx, 'rolling_mean_7d'])
            future_df.loc[current_idx, 'log_rolling_std_7d'] = np.log1p(future_df.loc[current_idx, 'rolling_std_7d'])
            future_df.loc[current_idx, 'log_lag_1h'] = np.log1p(future_df.loc[current_idx, 'lag_1h'])
            future_df.loc[current_idx, 'log_lag_24h'] = np.log1p(future_df.loc[current_idx, 'lag_24h'])
            future_df.loc[current_idx, 'log_lag_7d'] = np.log1p(future_df.loc[current_idx, 'lag_7d'])

            # Prepare features for the current date
            X_current = future_df.loc[current_idx, features + ['zone_id']]
            X_current_transformed = pipeline.named_steps['preprocessor'].transform(X_current)
            y_current_pred = pipeline.named_steps['model'].predict(X_current_transformed)
            future_df.loc[current_idx, 'log_busyness_score'] = y_current_pred

    # Filter future_df for the desired prediction timestamp
    final_predictions = future_df[future_df['transit_timestamp'] == prediction_time]

    # Prepare the final predictions DataFrame in the desired format
    predictions = pd.DataFrame({
        'timestamp': final_predictions['transit_timestamp'],
        'zone_id': final_predictions['zone_id'],
        'predicted_log_busyness_score': final_predictions['log_busyness_score'],
        'predicted_busyness_score': np.expm1(final_predictions['log_busyness_score'])
    })

    return predictions
