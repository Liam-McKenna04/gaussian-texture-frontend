import { useState, useEffect } from 'react';

function randn_bm() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num;
}



async function generateGaussianImage(mean: number, stdDev: number) {
  const CANVAS_SIZE = 256;
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  
  for (let y = 0; y < CANVAS_SIZE; y++) {
    for (let x = 0; x < CANVAS_SIZE; x++) {
      let Z = randn_bm();     
      let pixelValue = Math.floor((Z * stdDev) + mean);
      pixelValue = Math.min(255, Math.max(0, pixelValue));
      
      ctx.fillStyle = `rgba(${pixelValue}, ${pixelValue}, ${pixelValue}, 1)`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  
  return canvas.toDataURL();
}

export function useNoise(mean: number, stdDev: number) {
  const [imageBase64, setImageBase64] = useState<string>('');

  useEffect(() => {
    generateGaussianImage(mean, stdDev).then(setImageBase64);
  }, [mean, stdDev]);

  return imageBase64;
}
