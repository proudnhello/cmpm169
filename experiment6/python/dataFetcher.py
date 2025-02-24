import os
import sys
import requests
import json

# If you want to run this yourself, you need to get your own API key from Google Cloud Platform (which is free)
# and set it as an environment variable. On Windows, you can do this by searching for Edit Environment Variables for you Account in the start menu.
# Don't know how to do it on other OSes, but it should be similar.
API_KEY = os.environ.get('YOUTUBE_API_KEY')

if not API_KEY:
    print('You need to set the YOUTUBE_API_KEY environment variable')
    sys.exit()

# If the user doesn't provide a location, we'll use the coordinates of UCSC
if(len(sys.argv) != 5):
    latitude = 36.994689
    longitude = -122.060982
    radius = '1mi'
    name = 'data'
else:
    latitude = sys.argv[1]
    longitude = sys.argv[2]
    radius = sys.argv[3]
    name = sys.argv[4]

# First, construct the search query URL
searchURL = f'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&order=viewCount&key={API_KEY}&location={latitude},{longitude}&locationRadius={radius}'
# Then, the video parameters
videoURL = f'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key={API_KEY}&id='

# Then, fetch the data
response = requests.get(searchURL)
data = response.json()
print(searchURL)
print(data)
ids = []

for item in data['items']:
    ids.append(item['id']['videoId'])

# Construct the video URL. We can save API calls by fetching multiple videos at once, so this appends all the video IDs to the URL with commas
for videoId in ids:
    videoURL += videoId + ','
# Remove the last comma
videoURL = videoURL[:-1]
print(videoURL)

response = requests.get(videoURL)
print(response.json())
videoData = response.json()

json.dump(videoData, open('../data/' + name + '.json', 'w'), indent=4)