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
  const img = new Image();
  img.src = 'assets/3.png';
  context.translate(canvas.clientWidth-10, 180);
  context.rotate(3.14);
  context.drawImage(img, 0, 0, 50, 150);
  //canvas.addEventListener('click', () => window.console.log('click!'));
  const audio = document.querySelector('.control');
  const listOfSongs = document.querySelector('.list-songs');
  listOfSongs.addEventListener('click', ev => {
    if(ev.target === 'song' || 'singer' || 'song-item') {
      let audioSource = handlerChoiceSong(ev);
      audio.src=audioSource;
      audio.autoplay = true;
    }
  });
};