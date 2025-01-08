import React, { useState } from 'react'

type SourceProps = {
  title: string,
  min: number,
  max: number,
  step?: number,
  unit: string,
  impact: number, // In kgCO2e/year
}

const Source = (props: SourceProps) => {

  const [sliderValue, setSliderValue] = useState(Math.round((props.min + props.max) / 2))
  const sourceImpact = roundToDecimals(sliderValue * props.impact);

  function roundToDecimals(value: number, decimals: number = 2): number {
    const multiplier = Math.pow(10, decimals);
    return Math.ceil(value * multiplier) / multiplier;
  }

  return (
    <div className='w-full bg-zinc-50 p-10 rounded-xl'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold text-lg'>{props.title}</h3>
        <span>
          <span className='font-bold text-lg'>{sliderValue}</span>
          &nbsp;{props.unit}
        </span>
      </div>
      <input type="range" value={sliderValue} min={props.min} max={props.max} step={props.step ?? 1} onChange={(e) => setSliderValue(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none my-3" />
      {sourceImpact} kgCO2e / an
    </div>
  )
}

export default Source
