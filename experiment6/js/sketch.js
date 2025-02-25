let canvasContainer = $("#canvas-container");

let latContainer = $("#lat");
let longContainer = $("#long");
let radiusContainer = $("#radius");
let searchButton = $("#search-button");

searchButton.click(function() {
    let lat = latContainer.val();
    let long = longContainer.val();
    let radius = radiusContainer.val();

    if(apiKey === "null") {
        apiKey = prompt("Please enter your Google API key");
        if(apiKey === null || apiKey === "" || apiKey === "null") {
            alert("Please enter a valid API key to continue");
            apiKey = "null";
            return;
        }
    }

    let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&order=viewCount&key='+apiKey+'&location='+lat+','+long+'&locationRadius='+radius+'mi';
    
    fetch(url)
    .then(response => response.json())
    .then(handleSearchResults);
});

// Fetch the json data
let initialData = fetch('./resources/harrison.json')
  .then(response => response.json())
  .then(processData);

let apiKey = "null"

function handleSearchResults(data) {
    if(data['error'] !== undefined) {
        console.log(data);
        alert("An error occurred: " + data['error']['message']);
        // If the error is due to an invalid API key, prompt the user to enter a new one
        console.log(data['error']['details']['0']['reason']);
        if(data['error']['code'] === 403 || data['error']['details']['0']['reason'] === 'API_KEY_INVALID') {
            apiKey = "null"
        }
        return;
    }
    let videoIds = [];
    for (let i = 0; i < data['items'].length; i++) {
        videoIds.push(data['items'][i]['id']['videoId']);
    }

    let videoIdString = videoIds.join(',');

    let url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id='+videoIdString+'&key='+apiKey;

    fetch(url)
    .then(response => response.json())
    .then(processData);
}
  
function processData(data) {
    if(data['error'] !== undefined) {
        console.log(data);
        alert("An error occurred: " + data['error']['message']);
        // If the error is due to an invalid API key, prompt the user to enter a new one
        console.log(data['error']['details']['0']['reason']);
        if(data['error']['code'] === 403 || data['error']['details']['0']['reason'] === 'API_KEY_INVALID') {
            apiKey = "null"
        }
        return;
    }

    canvasContainer.empty();

    let videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');
    canvasContainer.append(videoContainer);
    for (let i = 0; i < data['items'].length; i++) {
        let vidData = data['items'][i];

        let videoCard = document.createElement('div');
        videoCard.classList.add('video-card');
        videoContainer.append(videoCard);
        
        let thumbnail = document.createElement('img');
        thumbnail.classList.add('thumbnail');
        thumbnail.src = vidData['snippet']['thumbnails']['medium']['url'];
        videoCard.append(thumbnail);

        let vidInfo = document.createElement('div');
        vidInfo.classList.add('video-info');
        videoCard.append(vidInfo);

        let vidTitle = document.createElement('a');
        vidTitle.classList.add('video-title');
        vidTitle.textContent = vidData['snippet']['title'];
        vidTitle.setAttribute('href', 'https://www.youtube.com/watch?v=' + vidData['id']);
        vidInfo.append(vidTitle);

        let vidUploader = document.createElement('div');
        vidUploader.classList.add('video-uploader');
        vidUploader.textContent = vidData['snippet']['channelTitle'];
        vidInfo.append(vidUploader);

        let vidDate = document.createElement('div');
        vidDate.classList.add('video-stats')
        vidDate.textContent = vidData['statistics']['viewCount'] + ' views • ' + vidData['snippet']['publishedAt'];
        vidInfo.append(vidDate);
    }
}