import { useState } from "react";
import Source, { SourceProps } from "./Source";
import { roundToDecimals } from "./util";

type SourceConfig = Omit<SourceProps, "value" | "onValueChange">;

function App() {
  const sources: SourceConfig[] = [
    {
      title: "Stockage",
      min: 1,
      max: 50,
      unit: "Tb",
      impact: 0.0936,
      dataSource:
        "https://greenly.earth/en-gb/blog/ecology-news/what-is-the-carbon-footprint-of-data-storage",
    },
    {
      title: "Transferts / an",
      min: 100,
      max: 10_000,
      step: 100,
      unit: "Gb",
      impact: 0.066,
      dataSource:
        "https://greenly.earth/en-gb/blog/ecology-news/what-is-the-carbon-footprint-of-data-storage",
    },
  ];

  const [sourceValues, setSourceValues] = useState<Record<string, number>>(
    Object.fromEntries(
      sources.map((config) => [
        config.title,
        Math.round((config.min + config.max) / 2),
      ]),
    ),
  );

  const totalImpact: number = roundToDecimals(
    sources.reduce(
      (sum, config) => sum + sourceValues[config.title] * config.impact,
      0,
    ),
    1,
  );

  const handleSourceChange = (title: string, value: number) => {
    setSourceValues((prev) => ({ ...prev, [title]: value }));
  };

  return (
    <div className="mx-32 my-24">
      <div className="px-12 py-10 bg-zinc-50 rounded-xl border">
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
          Calculateur de Consommation
        </h1>
        <h2 className="text-lg font-semibold text-zinc-500">
          Quelle conso pour mon cloud ?
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-6">
        {sources.map((config) => (
          <Source
            key={config.title}
            {...config}
            value={sourceValues[config.title]}
            onValueChange={(value) => handleSourceChange(config.title, value)}
          />
        ))}
        <div className="w-full bg-green-50 border border-green-200 p-10 rounded-xl">
          <h3 className="text-lg text-green-700 font-bold">
            Consommation totale
          </h3>
          <span className="text-4xl font-black text-green-800 geist-mono">
            {totalImpact}
          </span>
          <span className="text-green-700 font-semibold text-lg">
            &nbsp;kWh / an
          </span>
          <br />
          <span className="text-green-600">
            soit&nbsp;
            <span className="font-semibold geist-mono">
              {roundToDecimals(totalImpact * 0.42735, 1)} kgCO2e
            </span>
            &nbsp;émis par an
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
