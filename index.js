function handlerChoiceSong(event) {
  const data = {
    'url': '',
    'artist' : '',
    'song': ''
  };
  if (event.target.className === 'song' || 'singer') {
    data.url = event.target.parentNode.dataset.url;
    data.artist = event.target.parentNode.querySelector('.singer').textContent.trim();
    data.song = event.target.parentNode.querySelector('.song').textContent.trim();

  }
  if (event.target.className === 'song-item') {
    data.url = event.target.dataset.url;
    data.artist = event.target.querySelector('.singer').textContent.trim();
    data.song = event.target.querySelector('.song').textContent.trim();
  }
  return data;
}

function drawCircleText(context, text, radius, startRotation) {
  let numRadsPerLetter = 2*Math.PI / text.length;
   context.save();
   const x = context.canvas.width/2 - 14;
   const y = context.canvas.height/2 - 7;
   context.translate(x,y);
   context.rotate(startRotation);

   for(let i = 0; i < text.length; i++){
      context.save();
      context.rotate(i * numRadsPerLetter);
      context.fillText(text[i], 0, -radius);
      context.restore();
   }
   context.restore();
}

function buildPlaylist(jsonValue) {
  const value = jsonValue;
  const playlist = document.querySelector('.list-songs');
  value.forEach(element => {
    const itemList = document.createElement('li');
    itemList.setAttribute('data-url', `${ element.url }`);
    itemList.className = 'song-item';
    const singerName = document.createElement('span');
    singerName.className = 'singer';
    singerName.textContent = element.artist;
    itemList.appendChild(singerName);
    const songName = document.createElement('span');
    songName.className = 'song';
    songName.textContent = element.song;
    itemList.appendChild(songName);
    playlist.appendChild(itemList);  
  });

}
async function fetchData () {
  const response = await fetch('./assets/data/data.json');
  buildPlaylist(await response.json());
}

function defineCoordinate() {
  const x = window.event.layerX;
  const y = window.event.layerY;
  return {x, y};
}
function handlerDefineCurrentTimeSong(audio) {
  const { x, y } = defineCoordinate();
  let len = Math.sqrt(Math.pow((x - 137), 2) + Math.pow( y - 145, 2));
  if( len < 130) {
    let currentTime = (130-len)*audio.duration/75;
    audio.currentTime = currentTime;
    let angle = 0.5 * currentTime/audio.duration;
    return angle;
  }
  return;
}
function startPage(canvas, context) {
  const img = new Image();
  img.src = 'assets/3.png';
  context.drawImage(img, canvas.width - 42, 20, 50, 180);
  return img;
}

function drawDiskAndRunner(canvas, context, imgDisk, img) {
  context.restore();
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);  
  context.drawImage(imgDisk, 2, 10, 270, 270);
  context.drawImage(img, canvas.width - 42, 20, 50, 180);
  context.restore();
}

function redrawDiskAndRunner(canvas, context, imgDisk, img, titleSong, angle, startPositionText) {
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  context.drawImage(imgDisk, 2, 10, 270, 270);
  drawCircleText(context, titleSong, 30, 10 + startPositionText * 0.08);

  context.save();
  context.translate(canvas.clientWidth - 42, 20);
  context.rotate(angle);
  context.drawImage(img, 0, 0, 50, 180);
  context.restore();
}

transformTime = (duration) => {
  let minutes = Math.trunc(duration / 60);
  let partMinutes = `${Math.trunc(minutes / 10)}${minutes % 10}`;
  let seconds = Math.floor(duration % 60, 2);
  let partSeconds =  `${Math.trunc(seconds / 10)}${seconds % 10}`;
  return partMinutes + ':' + partSeconds;
}

window.onload = function load() {
  fetchData();
  const canvas = document.querySelector('.canvas');
  const context = canvas.getContext('2d');
  context.save();

  const img = startPage(canvas, context);

  const audio = document.querySelector('.control');
  const listOfSongs = document.querySelector('.list-songs');
  const duration = document.querySelector('.duration');
  const currentTimeIndication = document.querySelector('.current-time');

  listOfSongs.addEventListener('click', ev => {
    if(ev.target === 'song' || 'singer' || 'song-item') {
      let {url, artist, song} = handlerChoiceSong(ev);
      let titleSong = `${artist} - ${song}`;
      audio.src = url;
      
      audio.onloadedmetadata = function() {
                let durationInMinutes = ' ' + transformTime(this.duration) + `  `; 
                titleSong += durationInMinutes;

                context.globalCompositeOperation = 'source-over';
                context.fillStyle = 'silver';
                context.font = "bold 10px Courier";
                drawCircleText(context, titleSong, 30, 10);
                
                duration.textContent = durationInMinutes;
            };
      const imgDisk = new Image();
      imgDisk.src = 'assets/1.png';
      drawDiskAndRunner(canvas, context, imgDisk, img);

      const buttonPlay = document.querySelector('.button-play');
      const buttonStop = document.querySelector('.button-stop');
      let isFirstClick = true;
      let angle = 0;
      let count = 1;
      angle = 0.1;
      buttonPlay.addEventListener('click', (ev) => {
        canvas.addEventListener('click', () => {
          angle = handlerDefineCurrentTimeSong(audio) || angle;
          redrawDiskAndRunner(canvas, context, imgDisk, img, titleSong, angle, count);
        });
        if(isFirstClick) {
          redrawDiskAndRunner(canvas, context, imgDisk, img, titleSong, angle, count);
          audio.play();
          let lastCurrentTime;
          let change = setTimeout(function tick(){
            if((audio.currentTime !== 0) & (lastCurrentTime !==  audio.currentTime)) {
              redrawDiskAndRunner(canvas, context, imgDisk, img, titleSong, angle, count);
              currentTimeIndication.textContent = transformTime(audio.currentTime);
              count++;
              angle += 0.5/audio.duration;
              change = setTimeout(tick, 1000); 
              lastCurrentTime = audio.currentTime; 
            } else clearTimeout(change);
          }, 1000);
        } else {
          audio.pause();
          redrawDiskAndRunner(canvas, context, imgDisk, img, titleSong, angle, count);
        }
            isFirstClick = !isFirstClick;
            
        });
      buttonStop.addEventListener('click', () => {
      audio.pause(); 
      audio.currentTime = 0;
      isFirstClick = true;
      angle = 0;
      redrawDiskAndRunner(canvas, context, imgDisk, img, titleSong, angle);
      angle = 0.1;
      currentTimeIndication.textContent = `--:--`;
    });
    }
  });
};