"""_summary_
This script fetches data from the New York State Open Data API and saves it to a CSV file.
"""
import requests
import csv
import time
import os

# Define the API endpoint
api_url = "https://data.ny.gov/resource/wujg-7c2s.csv"
offset = 0
limit = 1000
total_rows = 58306773
output_file = "full_subway_data.csv"

# Check if there's an existing file to resume from
if os.path.exists(output_file):
    with open(output_file, 'r') as f:
        reader = csv.reader(f)
        existing_data = list(reader)
    offset = len(existing_data) - 1  # Subtract one for the header
    print(f"Resuming from row {offset}")
else:
    existing_data = []
    print("Starting fresh")

while offset < total_rows:
    # Construct the query URL with offset and limit
    query_url = f"{api_url}?$limit={limit}&$offset={offset}"
    print(f"Fetching: {query_url}")

    try:
        # Fetch the data
        response = requests.get(query_url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        print("Retrying in 5 seconds...")
        time.sleep(5)
        continue

    # Read the data
    data = response.text.splitlines()

    # If the length of data (excluding header) is less than the limit, we're done
    if len(data) <= 1:
        print("No more data found.")
        break

    # If starting fresh, capture the header
    if offset == 0 and not existing_data:
        header = data[0]
        existing_data.append(data[0])  # Add the header
        data = data[1:]  # Remove the header from the data

    existing_data.extend(data)  # Add the fetched data

    # Increase the offset for the next batch
    offset += limit

    # Save progress periodically to avoid data loss
    if offset % (10 * limit) == 0:  # Save every 10,000 rows
        with open(output_file, "w", newline='') as f:
            writer = csv.writer(f)
            for row in existing_data:
                writer.writerow(row.split(','))
        print(f"Progress saved at row {offset}")

# Save the final data to a CSV file
with open(output_file, "w", newline='') as f:
    writer = csv.writer(f)
    for row in existing_data:
        writer.writerow(row.split(','))

print(f"Data saved to {output_file}")
