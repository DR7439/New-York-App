import pandas as pd
from datetime import datetime

from predictions_function import make_predictions

def test_make_predictions():
    # Define a prediction time for testing
    prediction_time = datetime.now().strftime('2024-05-02 00:00:00')

    path_to_zones_csv = './model_data/zones_df.csv'
    path_to_latest_historical_data_csv = './model_data/latest_historical_data.csv'
    path_to_pickle_file = './model_data/xgboost_busyness_model.pkl'

    predictions = make_predictions(prediction_time,path_to_pickle_file, path_to_zones_csv, path_to_latest_historical_data_csv)

    # Print the predictions DataFrame
    print(predictions)

if __name__ == "__main__":
    test_make_predictions()
