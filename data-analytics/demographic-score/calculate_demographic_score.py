import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

def validate_selection(selection, valid_values, selection_name):
    # Special case for gender selection
    if selection_name == 'genders' and set(selection) == {'Male', 'Female', 'Male and Female'}:
        selection = ['Male and Female']

    invalid_values = [item for item in selection if item not in valid_values]
    if invalid_values:
        raise ValueError(f"Invalid {selection_name} values: {invalid_values}")

    return selection


def calculate_combined_scores_and_ranks(demographics_data, business_data, selected_genders, selected_age_groups, selected_businesses, demographic_weight=0.5, business_weight=0.5):
    """
    Calculate combined average scores and ranks for zones based on selected demographics and business types.

    Parameters:
    - demographics_data (pd.DataFrame): DataFrame containing demographic data with columns ['gender', 'age_group', 'zone_id', 'score', 'rank'].
    - business_data (pd.DataFrame): DataFrame containing business data with columns ['zone_id', 'business_type', 'score', 'rank'].
    - selected_genders (list of str): List of selected genders to filter the demographic data.
    - selected_age_groups (list of str): List of selected age groups to filter the demographic data.
    - selected_businesses (list of str): List of selected business types to filter the business data.
    - demographic_weight (float): Weight for the demographic score in the final calculation. Must sum to 1 with business_weight.
    - business_weight (float): Weight for the business score in the final calculation. Must sum to 1 with demographic_weight.

    Returns:
    - pd.DataFrame: DataFrame with combined average scores and ranks for each zone, with columns ['zone_id', 'average_score', 'average_rank'].

    Raises:
    - ValueError: If any of the selected genders, age groups, or business types are invalid or if the weights do not sum to 1.
    """
    # Make sure weights make sense.
    if demographic_weight + business_weight != 1:
        raise ValueError("The sum of demographic_weight and business_weight must be 1.")

    # Validate user input.
    valid_genders = demographics_data['gender'].unique()
    selected_genders = validate_selection(selected_genders, valid_genders, 'genders')

    valid_age_groups = demographics_data['age_group'].unique()
    selected_age_groups = validate_selection(selected_age_groups, valid_age_groups, 'age groups')

    valid_business_types = business_data['business_type'].unique()
    selected_businesses = validate_selection(selected_businesses, valid_business_types, 'business types')

    # Filter demographics data
    filtered_demographics = demographics_data[(demographics_data['gender'].isin(selected_genders)) &
                                              (demographics_data['age_group'].isin(selected_age_groups))]

    # Calculate average demographic score for each zone
    avg_demographic_scores = filtered_demographics.groupby('zone_id')['score'].mean().reset_index()

    # Filter business data based on selected business types
    filtered_business_data = business_data[business_data['business_type'].isin(selected_businesses)]

    # Calculate average business score for each zone
    avg_business_scores = filtered_business_data.groupby('zone_id')['score'].mean().reset_index()

    # Merge scores
    combined_data = avg_demographic_scores.merge(avg_business_scores, on='zone_id', how='outer', suffixes=('_demographic', '_business'))

    # Fill NaN values with 0, because some zones may not have demographic or business data.
    combined_data = combined_data.fillna(0)

    # Calculate final combined average score for each zone with weights
    combined_data['final_avg_score'] = (combined_data['score_demographic'] * demographic_weight + combined_data['score_business'] * business_weight)

    #apply min-max scaling to final average score
    # combined_data['final_avg_score'] = (combined_data['final_avg_score'] - combined_data['final_avg_score'].min()) / (combined_data['final_avg_score'].max() - combined_data['final_avg_score'].min())*100

    # Calculate percentile rank based on final average score
    combined_data['percentile_rank'] = combined_data['final_avg_score'].rank(pct=True) * 100

    # Select and rename columns
    result = combined_data[['zone_id', 'final_avg_score', 'percentile_rank']]
    result = result.rename(columns={'final_avg_score': 'average_score', 'percentile_rank': 'average_rank'})

    return result