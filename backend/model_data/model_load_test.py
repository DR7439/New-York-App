import joblib
import os

model_path = os.path.join(os.path.dirname(__file__), 'xgboost_busyness_model.pkl')

try:
    model = joblib.load(model_path)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Failed to load model: {str(e)}")
