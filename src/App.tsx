import { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent } from "./components/ui/card";
import { useNoise } from './hooks/useNoise';
import { Label } from './components/ui/label';
import { Slider } from './components/ui/slider';

import { Moon, Sun, Tally4, AudioLines, EyeOff, Eye, Download, Copy } from 'lucide-react';
import { Input } from './components/ui/input';
const presets = [
  {
    mean: 128,
    stdDev: 50,
    opacity: 5,
    name: 'Default'
  },
  {
    mean: 100,
    stdDev: 20,
    opacity: 5,
    name: 'Soft Noise'
  },
  {
    mean: 128,
    stdDev: 100,
    opacity: 10,
    name: 'High Contrast'
  }
];
const isLightColor = (hexColor: string) => {
  // Remove the # if present
  const hex = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
};
function App() {
  const [mean, setMean] = useState(128);
  const [stdDev, setStdDev] = useState(50);
  const imageBase64 = useNoise(mean, stdDev);
  const [visible, setVisible] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#18181b');
  const [opacity, setOpacity] = useState(5);
  const [copied, setCopied] = useState(false);
  

  const handleCopy = () => {
    navigator.clipboard.writeText(`bg-[${backgroundColor}] {noise-[${mean},${stdDev},${opacity}]`);
    setCopied(true);
    setTimeout(() => setCopied(false), 700);
  };

  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    
    // Convert base64 to blob
    const byteString = atob(imageBase64.split(',')[1]);
    const mimeString = imageBase64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeString });
    const url = URL.createObjectURL(blob);
    
    // Set up download
    link.href = url;
    link.download = `noise-${mean}-${stdDev}.png`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const textColor = isLightColor(backgroundColor) ? 'text-black' : 'text-white';
  const subTextColor = isLightColor(backgroundColor) ? 'text-zinc-700' : 'text-zinc-300';


  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative" style={{backgroundColor: backgroundColor}}>
    <div className="absolute h-full w-full bg-repeat rounded-none z-0 pointer-events-none" 
    style={{backgroundImage: `url(${imageBase64})`, opacity: opacity/100}} 
    ></div>

      <h1 className={`text-5xl font-bold mt-5 sm:mt-10 mb-2 poppins-bold text-center z-10 ${textColor}`} 
          style={{opacity: visible ? 100 : 0}}>
        Grain/Noise Generator
      </h1>
      <p className={`text-lg font-bold mb-5 poppins-medium z-10 ${subTextColor}`} 
         style={{opacity: visible ? 100 : 0}}>
        Create Gaussian White Noise Textures
      </p>

      <Card className=" md:w-full max-w-3xl bg-zinc-900 border text-white z-0 flex flex-col-reverse 
                        items-center md:flex-row p-4 justify-between rounded-none" 

            style={{opacity: visible ? 100 : 0}}>
        <CardContent className="flex flex-col items-center relative">
          <Label className='w-full mb-2 font-md poppins-medium'>Presets</Label>

          <div className="flex flex-wrap gap-2 justify-center">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="secondary"
                className={`rounded-none poppins-medium ${preset.mean === mean && preset.stdDev === stdDev && "bg-amber-200 hover:bg-amber-200"}`}
                onClick={() => {
                  setMean(preset.mean);
                  setStdDev(preset.stdDev);
                  setOpacity(preset.opacity);
                }}
              >
                {preset.name}
              </Button>
            ))}
          </div>
          <Label className='w-full mb-2 font-md poppins-medium mt-4'>Background Color</Label>
          <div className="flex gap-2 w-full items-center">
                  <Input
                    id="color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-20 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={backgroundColor.toUpperCase()}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 h-10 font-mono"
                  />
                </div>


            <div className="w-full space-y-4 mt-6">
              <div className="space-y-2">
                <div className="flex justify-between gap-1 text-sm poppins-medium">
                  <Label>Mean</Label>
                  <Label>{mean}</Label>
                </div>
                <div className="w-full flex items-center gap-2 flex-row">
                  <Moon size={24} />
                <Slider
                  min={0}
                  max={255}
                  value={[mean]}
                  step={1}
                  onValueChange={(value) => setMean(value[0])}

                  className="w-full"
                />
                <Sun size={24} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between gap-1 text-sm poppins-medium">
                  <Label>Standard Deviation</Label>
                  <Label>{stdDev}</Label>
                </div>
                <div className="w-full flex items-center gap-2 flex-row">
                  <Tally4 size={24} />
                <Slider
                  min={0}
                  max={255}
                  value={[stdDev]}
                  step={1}
                  onValueChange={(value) => setStdDev(value[0])}

                  className="w-full"
                />
                <AudioLines size={24} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between gap-1 text-sm poppins-medium">
                  <Label>Opacity (background)</Label>
                  <Label>{opacity}</Label>
                </div>
                <div className="w-full flex items-center gap-2 flex-row">
                  <EyeOff size={24} />
                <Slider
                  min={0}
                  max={100}
                  value={[opacity]}
                  step={1}
                  onValueChange={(value) => setOpacity(value[0])}

                  className="w-full"
                />
                <Eye size={24} />
                </div>
              </div>
            </div>
          <div className="flex flex-col justify-between w-full gap-2 mt-4">
            <Button 
              className="rounded-none poppins-medium flex-1 text-black mt-4" 
              onClick={handleDownload}
            >
              Download Texture
              <Download size={24} className="inline-block ml-2" />
            </Button>

            <Button 
              className="rounded-none poppins-medium flex-1 text-black bg-amber-200 hover:bg-amber-300" 
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy Tailwindcss Class'} <Copy size={24} className="inline-block ml-2" />
            </Button>
          </div> 
          <Button variant="link" asChild className="text-zinc-300 poppins-medium text-sm">
            <a href='https://github.com/Liam-McKenna04/tailwindcss-noise'>Get Tailwindcss Plugin</a>
          </Button>

        </CardContent>
        {imageBase64 && (
            <div className="relative">
              <div className=" overflow-hidden">
                <img src={imageBase64} alt="Gaussian Noise" width="300" height="300" className="block" />
              </div>
            </div>
          )}
      </Card>

      <Button
            variant="outline"
            size="lg"
            className='rounded-none text-white bottom-4 my-5 md:absolute md:mb-0 z-10'
            onClick={() => setVisible(!visible)}
          >
            {visible ? 'Hide UI' : 'Show UI'}
          </Button> 
    </div>
  );
}

export default App;