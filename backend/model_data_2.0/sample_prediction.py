import busyness_prediction
import pandas as pd
import matplotlib.pyplot as plt

# Make predictions using the busyness prediction model
predictions = busyness_prediction.make_prediction('2025-09-19 18:00:00', 'busyness_model.pkl')

# Min-max scaling of the 'predicted_busyness_score' column to a 1-100 scale
min_score = predictions['predicted_busyness_score'].min()
max_score = predictions['predicted_busyness_score'].max()

predictions['normalized_busyness_score'] = 1 + (predictions['predicted_busyness_score'] - min_score) * 99 / (max_score - min_score)

# Plotting the normalized busyness score
plt.figure(figsize=(12, 6))
plt.scatter(predictions['zone_id'], predictions['normalized_busyness_score'], c='blue', label='Normalized Busyness Score')
plt.xlabel('Zone ID')
plt.ylabel('Normalized Busyness Score')
plt.title('Normalized Busyness Score by Zone ID')
plt.legend()
plt.grid(True)
plt.show()

print(predictions)
