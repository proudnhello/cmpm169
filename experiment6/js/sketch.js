let canvasContainer = $("#canvas-container");

// Fetch the json data
let data = fetch('./resources/harrison.json')
  .then(response => response.json())
  .then(processData);
  
function processData(data) {
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