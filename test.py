import calculate_demographic_score
#import result_visualisations
import pandas as pd

# Define the selections and weights
demographic_weight = 0.25
business_weight = 1 - demographic_weight
selected_genders = ['Male', 'Female']
selected_age_groups = ['25 to 29 years', '35 to 39 years']
selected_businesses= ['General store, department store, mall', 'Do-it-yourself, household, building materials, gardening', 'Food, beverages', 'Electronics']
metric = 'rank' #choose either 'score' or 'rank'
path_to_geojson = 'backend/mnt/data/NYC Taxi Zones.geojson'
#output_map_file = './data-analytics/demographic-score/color-map.html'

# Load the demographic and business data
demographics_data = pd.read_csv('backend/mnt/data/demographic_scores_and_ranks.csv')
business_data = pd.read_csv('backend/mnt/data/business_score_ranks.csv')

# Calculate the combined scores and ranks
final_results = calculate_demographic_score.calculate_combined_scores_and_ranks(demographics_data, business_data, selected_genders, selected_age_groups, selected_businesses, demographic_weight, business_weight)


print(final_results)