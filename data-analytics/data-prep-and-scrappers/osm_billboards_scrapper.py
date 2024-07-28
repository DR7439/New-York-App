import requests

# define the Overpass API endpoint
overpass_url = "http://overpass-api.de/api/interpreter"

#visual tool avaialbe at: https://overpass-turbo.eu/#

# define the Overpass QL query
overpass_query = """
[out:json];
area[name="Manhattan"]->.manhattan;
(
  node[advertising](area.manhattan);
  way[advertising](area.manhattan);
  relation[advertising](area.manhattan);
);
out body;
"""

# send the request to the Overpass API
response = requests.get(overpass_url, params={'data': overpass_query})

# check if the request was successful
if response.status_code == 200:
    data = response.json()
    billboards = data['elements']
    print(f"Found {len(billboards)} billboards in Manhattan")
    for billboard in billboards:
        try:
            print(f"Billboard at ({billboard['lat']}, {billboard['lon']})")
        except KeyError:
            print("Latitude or Longitude not available")   
else:
    print(f"Error: {response.status_code}")


