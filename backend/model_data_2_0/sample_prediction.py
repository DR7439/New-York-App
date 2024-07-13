import busyness_prediction
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Make predictions using the busyness prediction model
predictions = busyness_prediction.make_prediction('2100-09-19 18:00:00', 'busyness_model.pkl')

# Logarithmic scaling of the 'predicted_busyness_score' column to a 1-100 scale
# Adding a small value to avoid taking log of zero
predictions['log_normalized_score'] = np.log1p(predictions['predicted_busyness_score'])

# Min-max scaling the log-transformed scores to 1-100
min_log_score = predictions['log_normalized_score'].min()
max_log_score = predictions['log_normalized_score'].max()

predictions['log_normalized_score'] = 1 + (predictions['log_normalized_score'] - min_log_score) * 99 / (max_log_score - min_log_score)

# Plotting the log normalized busyness score
plt.figure(figsize=(12, 6))
plt.scatter(predictions['zone_id'], predictions['log_normalized_score'], c='blue', label='Log Normalized Busyness Score')
plt.xlabel('Zone ID')
plt.ylabel('Log Normalized Busyness Score')
plt.title('Log Normalized Busyness Score by Zone ID')
plt.legend()
plt.grid(True)
plt.show()

