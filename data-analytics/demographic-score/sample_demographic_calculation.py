import calculate_demographic_score
import result_visualisations
import pandas as pd

# Define the selections and weights
demographic_weight = 0.5
business_weight = 1 - demographic_weight
selected_genders = ['Female']
selected_age_groups = ['25 to 29 years', '30 to 34 years']
selected_businesses= ['General store, department store, mall', 'Health and beauty']
metric = 'score' #choose either 'score' or 'rank'
path_to_geojson = './data-analytics/datasets/NYC Taxi Zones.geojson'
output_map_file = f'./data-analytics/demographic-score/color-map-{metric}.html'

# Load the demographic and business data
demographics_data = pd.read_csv('./data-analytics/datasets/demographic_scores_and_ranks.csv')
business_data = pd.read_csv('./data-analytics/datasets/business_score_ranks.csv')

# Calculate the combined scores and ranks
final_results = calculate_demographic_score.calculate_combined_scores_and_ranks(demographics_data, business_data, selected_genders, selected_age_groups, selected_businesses, demographic_weight, business_weight)

# Create a color-coded map of the average rank across locations
result_visualisations.create_color_coded_map(final_results, path_to_geojson, metric=metric, path_to_output_map_file=output_map_file)

# Plot the distribution of the average rank across locations
# result_visualisations.plot_results(final_results, metric=f'average_{metric}')
