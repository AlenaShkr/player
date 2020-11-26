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
  console.log(data);
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
async function fetchAsync () {
  const response = await fetch('./assets/data/data.json');
  buildPlaylist(await response.json());
}

window.onload = function load() {
  fetchAsync();
  const canvas = document.querySelector('.canvas');
  const context = canvas.getContext('2d');
  context.save();
  const img = new Image();
  img.src = 'assets/3.png';
  context.translate(canvas.width, 0);
  context.rotate(0);
  context.drawImage(img, -42, 20, 50, 180);
  //canvas.addEventListener('click', () => window.console.log('click!'));
  const audio = document.querySelector('.control');
  const listOfSongs = document.querySelector('.list-songs');
  listOfSongs.addEventListener('click', ev => {
    if(ev.target === 'song' || 'singer' || 'song-item') {
      let {url, artist, song} = handlerChoiceSong(ev);
      let titleSong = `${artist} - ${song}`;
      audio.src = url;
      
      audio.onloadedmetadata = function() {
                console.log(this.duration);
                let durationInMinutes = ` ${Math.trunc(this.duration / 60)}:${Math.floor(this.duration % 60, 2)}  `; 
                titleSong += durationInMinutes;
                context.fillStyle = 'silver';

                context.font = "bold 10px Courier";
                drawCircleText(context, titleSong, 30, 10);
            };
      audio.autoplay = true;
      context.restore();
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      
      const imgDisk = new Image();
      imgDisk.src = 'assets/1.png';
      context.drawImage(imgDisk, 2, 10, 270, 270);
      
      context.save();
      context.translate(canvas.clientWidth, 0);
      context.rotate(0.1);
      context.drawImage(img, -42, 20, 50, 180);
      // context.rotate(0.5); max angle
      // context.drawImage(img, -28, 25, 50, 180);
      context.restore();

    }
  });
};