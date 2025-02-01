import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useNoise } from './hooks/useNoise';
import { Label } from './components/ui/label';
import { Slider } from './components/ui/slider';

import { Moon, Sun, Tally4, AudioLines } from 'lucide-react';
import { Input } from './components/ui/input';
const presets = [
  {
    mean: 128,
    stdDev: 50,
    name: 'Default'
  },
  {
    mean: 100,
    stdDev: 20,
    name: 'Soft Noise'
  },
  {
    mean: 128,
    stdDev: 100,
    name: 'High Contrast'
  }
];

function App() {
  const [mean, setMean] = useState(128);
  const [stdDev, setStdDev] = useState(50);
  const imageBase64 = useNoise(mean, stdDev);
  const [advanced, setAdvanced] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#18181b');
  const [visible, setVisible] = useState(true);
  console.log(imageBase64);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start" style={{backgroundColor: backgroundColor}}>
    <div className="absolute h-screen w-screen bg-repeat opacity-5 rounded-none z-0 pointer-events-none noise-md" 
    // style={{backgroundImage: `url(${imageBase64})`}}
    ></div>

      <h1 className='text-5xl font-bold text-white mt-5 sm:mt-20 mb-2 poppins-bold text-center' style={{opacity: visible ? 100 : 0}}>Grain/Noise Generator</h1>
      <p className='text-lg font-bold text-zinc-300 mb-5 md:mb-20 poppins-medium' style={{opacity: visible ? 100 : 0}}>Create Gaussian White Noise Textures</p>

      <Card className="md:w-full max-w-3xl bg-zinc-900 border text-white z-0 flex flex-col-reverse items-center md:flex-row p-4 justify-between rounded-none" style={{opacity: visible ? 100 : 0}}>
        <CardContent className="flex flex-col items-center">
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

          <Button
            variant="outline"
            className='rounded-none my-4'
            onClick={() => setAdvanced(!advanced)}
          >
            {advanced ? 'Hide Advanced' : 'Show Advanced'}
          </Button>

          {advanced && (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <div className="flex justify-center gap-1 text-sm">
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
                <div className="flex justify-center gap-1 text-sm">
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
            </div>
          )}
        </CardContent>
        {imageBase64 && (
            <div className="relative">
              <div className=" overflow-hidden">
                <img src={imageBase64} alt="Gaussian Noise" width="256" height="256" className="block" />
              </div>
            </div>
          )}
      </Card>

      <Button
            variant="outline"
            size="lg"
            className='rounded-none text-white mt-5 sm:absolute bottom-4'
            onClick={() => setVisible(!visible)}
          >
            {visible ? 'Hide UI' : 'Show UI'}
          </Button>    </div>
  );
}

export default App;