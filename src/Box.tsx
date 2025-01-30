import { formatUnit } from "./util";

type BoxProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function Box({ title, children, className = "" }: BoxProps) {
  return (
    <div
      className={`w-full bg-zinc-50 border p-6 md:p-10 rounded-xl ${className}`}
    >
      <h3 className="text-lg text-zinc-800 font-bold">{title}</h3>
      {children}
    </div>
  );
}

type BoxInputProps = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
  emoji?: string;
};

export function BoxInput({
  label,
  value,
  unit,
  min,
  max,
  onChange,
  emoji,
}: BoxInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target?.value);
    onChange(newValue); // Allow changing the value directly
  };

  return (
    <div className="flex items-center">
      <label className="flex items-center">
        {emoji && <span className="text-2xl mr-2">{emoji}</span>}
        {label}
      </label>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={handleInputChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none my-3 ms-2"
      />
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        className="ms-2 me-1 w-14 px-1 border border-zinc-200 rounded"
      />
      <span>{unit}</span>
    </div>
  );
}

type BoxConsumptionProps = {
  value: number;
};

export function BoxConsumption({ value }: BoxConsumptionProps) {
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t">
      <span className="text-zinc-600">Consommation</span>
      <span className="geist-mono">{formatUnit(value, "Wh/an")}</span>
    </div>
  );
}
