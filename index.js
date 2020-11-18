window.onload = function load() {
  const canvas = document.querySelector('.canvas');
  const context = canvas.getContext('2d');
  const img = new Image();
  img.src = 'assets/3.png';
  context.translate(canvas.clientWidth-10, 180);
  context.rotate(3.14);
  context.drawImage(img, 0, 0, 50, 150);
  console.log(canvas.clientWidth);
  canvas.addEventListener('click', () => window.console.log('click!'));
};