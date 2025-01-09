import { roundToDecimals } from "./util";

export type SourceProps = {
  title: string;
  min: number;
  max: number;
  step?: number;
  unit: string;
  impact: number; // In kWh/year
  dataSource: string; // url of source for metrics
  value: number;
  onValueChange: (value: number) => void;
};

const Source = (props: SourceProps) => {
  const sourceImpact = roundToDecimals(props.value * props.impact);

  return (
    <div className="w-full bg-zinc-50 p-10 rounded-xl border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{props.title}</h3>
        <span className="text-lg geist-mono">
          <span className="font-bold">{props.value}</span> {props.unit}
        </span>
      </div>
      <input
        type="range"
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        onChange={(e) => props.onValueChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none my-3"
      />
      <div className="flex items-center justify-between">
        <span className="geist-mono">{sourceImpact} kWh/an</span>
        <a
          href={props.dataSource}
          className="text-sm hover:underline cursor-pointer text-blue-700"
        >
          Source
        </a>
      </div>
    </div>
  );
};

export default Source;
