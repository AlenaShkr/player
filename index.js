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
  context.translate(canvas.width, 0);
  context.rotate(0);
  context.drawImage(img, -42, 20, 50, 180);
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