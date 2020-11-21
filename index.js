function handlerChoiceSong(event) {
  let url; 
  if (event.target.className === 'song' || 'singer') {

    url = event.target.parentNode.dataset.url;
  }
  if (event.target.className === 'song-item') {
    url = event.target.dataset.url;
  }
  return url;
}

window.onload = function load() {
  const canvas = document.querySelector('.canvas');
  const context = canvas.getContext('2d');
  context.save();
  const img = new Image();
  img.src = 'assets/3.png';
  context.translate(canvas.clientWidth, 200);
  context.rotate(3.14);
  context.drawImage(img, -10, 0, 50, 180);
  
  //canvas.addEventListener('click', () => window.console.log('click!'));
  const audio = document.querySelector('.control');
  const listOfSongs = document.querySelector('.list-songs');
  listOfSongs.addEventListener('click', ev => {
    if(ev.target === 'song' || 'singer' || 'song-item') {
      let audioSource = handlerChoiceSong(ev);
      audio.src=audioSource;
      audio.onloadedmetadata = function() {
                console.log(this.duration);
            };
      audio.autoplay = true;
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      context.restore();
      const imgDisk = new Image();
      imgDisk.src = 'assets/1.png';
      
      context.drawImage(imgDisk, 2, 10, 270, 270);
      context.save();
      context.translate(canvas.clientWidth+10, 200);
      context.rotate(3.3);
      context.drawImage(img, 25, 0, 50, 180);
      context.restore();
    }
  });
};