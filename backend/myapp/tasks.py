from celery import shared_task
from django.utils import timezone
from .models import Search, Busyness, Demographic, Zone, PopulationData, InterestZoneCount
import random
import datetime
from model_data_2_0 import busyness_prediction
from datetime import timedelta
import pandas as pd
import numpy as np

import time

@shared_task
def background_task(search_id):
    print(f'Background task started for search_id: {search_id}')
    print("OK")
    start = time.time()
    search = Search.objects.get(id=search_id)
    zones = Zone.objects.all()


    
    if search.gender == 'M':
        selected_genders = ['Male']
    elif search.gender == 'F':
        selected_genders = ['Female']
    else:
        selected_genders = ['Male', 'Female']
    selected_age_groups = [age_category.age_range for age_category in search.target_age.all()]
    selected_businesses = [interest.name for interest in search.target_market_interests.all()]

    # Define the selections and weights
    demographic_weight = 0.25
    business_weight = 1 - demographic_weight

    # Load the demographic and business data
    demographics_data = pd.read_csv('mnt/data/demographic_scores_and_ranks.csv')
    business_data = pd.read_csv('mnt/data/business_score_ranks.csv')

    # Calculate the combined scores and ranks
    combined_scores = calculate_combined_scores_and_ranks(demographics_data, business_data, selected_genders, selected_age_groups, selected_businesses, demographic_weight, business_weight)
    
    # Create demographic scores for each zone for the search
    for _, row in combined_scores.iterrows():
        zone = Zone.objects.get(id=row['zone_id'])
        Demographic.objects.update_or_create(
            zone=zone,
            search=search,
            defaults={'score': row['average_score']}
        )

   

    # Generate busyness scores for each hour of each day between start_date and end_date
    current_date = search.start_date
    end_date = search.end_date

    # while current_date <= end_date:
    #     for hour in range(24):
    #         naive_datetime = datetime.datetime.combine(current_date, datetime.time(hour=hour))
    #         aware_datetime = timezone.make_aware(naive_datetime)

    #         for zone in zones:
    #             busyness_entry = Busyness.objects.filter(datetime=aware_datetime, zone=zone).first()
    #             if busyness_entry:
    #                 busyness_score = busyness_entry.busyness_score
    #                 Busyness.objects.update_or_create(
    #                     datetime=aware_datetime,
    #                     zone=zone,
    #                     defaults={'busyness_score': busyness_score}
    #                 )
    #             else:
    #                 print(f"No busyness entry found for zone {zone.id} at {aware_datetime}")
    #     current_date += datetime.timedelta(days=1)

    print(f'Background task completed for search_id: {search_id} Time: {time.time() - start}')
    
@shared_task
def check_and_populate_busyness():
    now = timezone.now()
    end_date = now + timedelta(weeks=2)
    zones = Zone.objects.all()

    # Generate timestamps for every hour from now to 14 days ahead
    timestamps = pd.date_range(start=now, periods=14*24, freq='H')

    for timestamp in timestamps:
        for zone in zones:
            if not Busyness.objects.filter(zone=zone, datetime=timestamp).exists():
                # Make predictions using the busyness prediction model for the timestamp
                predictions = busyness_prediction.make_prediction(timestamp.strftime('%Y-%m-%d %H:%M:%S'), 'model_data_2_0/busyness_model.pkl')

                # Apply logarithmic scaling to the 'predicted_busyness_score'
                predictions['log_normalized_score'] = np.log1p(predictions['predicted_busyness_score'])

                # Min-max scaling the log-transformed scores to 1-100
                min_log_score = predictions['log_normalized_score'].min()
                max_log_score = predictions['log_normalized_score'].max()

                predictions['log_normalized_score'] = 1 + (predictions['log_normalized_score'] - min_log_score) * 99 / (max_log_score - min_log_score)

                # Populate the Busyness table
                for _, row in predictions.iterrows():
                    zone = Zone.objects.get(id=row['zone_id'])
                    busyness_score = row['log_normalized_score']

                    # Update or create Busyness object
                    Busyness.objects.update_or_create(
                        datetime=row['timestamp'],
                        zone=zone,
                        defaults={'busyness_score': busyness_score}
                    )



def calculate_demographic_score(zone, search):
    # Calculate age score (50 points max)
    total_population = sum(PopulationData.objects.filter(zone=zone).values_list('population', flat=True))
    target_population = sum(
        PopulationData.objects.filter(zone=zone, age_category__in=search.target_age.all()).values_list('population', flat=True)
    )
    age_score = (target_population / total_population) * 50 if total_population > 0 else 0

    # Calculate interest score (50 points max)
    total_interest_count = sum(
        InterestZoneCount.objects.filter(
            zone=zone, 
            interest__in=search.target_market_interests.all()
        ).values_list('count', flat=True)
    )

    interest_score = 0
    if total_interest_count >= 1000:
        interest_score = 50
    elif total_interest_count > 0:
        interest_score = (total_interest_count / 1000) * 50

    # Combine scores
    demographic_score = age_score + interest_score
    
    
    return demographic_score









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
    combined_data['final_avg_score'] = (combined_data['final_avg_score'] - combined_data['final_avg_score'].min()) / (combined_data['final_avg_score'].max() - combined_data['final_avg_score'].min())*100

    # Calculate percentile rank based on final average score
    combined_data['percentile_rank'] = combined_data['final_avg_score'].rank(pct=True) * 100

    # Select and rename columns
    result = combined_data[['zone_id', 'final_avg_score', 'percentile_rank']]
    result = result.rename(columns={'final_avg_score': 'average_score', 'percentile_rank': 'average_rank'})

    return result
