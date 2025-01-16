import {
  CO2_INTENSITY,
  CloudProvider,
  REGIONS_BY_PROVIDER,
} from "./cloudProviderData";
import Source, { SourceProps } from "./Source";

import { roundToDecimals } from "./util";
import { useState } from "react";

type SourceConfig = Omit<SourceProps, "value" | "onValueChange">;

const SOURCES = [
  {
    name: "Cloud Carbon Footprint",
    url: "https://www.cloudcarbonfootprint.org/docs/methodology/#appendix-v-grid-emissions-factors",
  },
  {
    name: "Greenly",
    url: "https://greenly.earth/en-gb/blog/ecology-news/what-is-the-carbon-footprint-of-data-storage",
  },
  {
    name: "Empreinte carbone en France en 2022",
    url: "https://www.statistiques.developpement-durable.gouv.fr/lempreinte-carbone-de-la-france-de-1995-2022",
  },
  
];

function App() {
  const [cloudProvider, setCloudProvider] = useState<CloudProvider>("AWS");
  const [region, setRegion] = useState<string>(REGIONS_BY_PROVIDER.AWS[0].id);

  const [cloudProviderBis, setCloudProviderBis] = useState<CloudProvider>("AWS");
  const [regionBis, setRegionBis] = useState<string>(REGIONS_BY_PROVIDER.AWS[0].id);

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
      max: 100_000,
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

  const co2Impact = roundToDecimals(
    totalImpact * CO2_INTENSITY[cloudProvider][region] * 1000,
    1,
  );

  const co2ImpactBis = roundToDecimals(
    totalImpact * CO2_INTENSITY[cloudProviderBis][regionBis] * 1000,
    1,
  );

  const individualReferenceImpact = roundToDecimals(
    co2Impact / 9200,
    1,
  );

  const handleSourceChange = (title: string, value: number) => {
    setSourceValues((prev) => ({ ...prev, [title]: value }));
  };

  const handleProviderChange = (newProvider: CloudProvider) => {
    setCloudProvider(newProvider);
    setRegion(REGIONS_BY_PROVIDER[newProvider][0].id);
  };


  const handleProviderChangeBis = (newProvider: CloudProvider) => {
    setCloudProviderBis(newProvider);
    setRegionBis(REGIONS_BY_PROVIDER[newProvider][0].id);
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
        <div className="w-full bg-zinc-50 border p-10 rounded-xl">
          <h3 className="text-lg text-zinc-800 font-bold">Cloud Provider</h3>
          <select
            value={cloudProvider}
            onChange={(e) =>
              handleProviderChange(e.target.value as CloudProvider)
            }
            className="mt-2 w-full p-2 rounded border border-zinc-200"
          >
            <option value="AWS">AWS</option>
            <option value="GCP">GCP</option>
            <option value="Azure">Azure</option>
          </select>
        </div>
        <div className="w-full bg-zinc-50 border p-10 rounded-xl">
          <h3 className="text-lg text-zinc-800 font-bold">Region</h3>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-2 w-full p-2 rounded border border-zinc-200"
          >
            {REGIONS_BY_PROVIDER[cloudProvider].map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {sources.map((config) => (
          <Source
            key={config.title}
            {...config}
            value={sourceValues[config.title]}
            onValueChange={(value) => handleSourceChange(config.title, value)}
          />
        ))}

        <div className="w-full bg-green-50 border border-green-200 p-10 rounded-xl col-span-2">
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
            <span className="font-semibold geist-mono">{co2Impact} kgCO2e</span>
            &nbsp;émis par an
          </span>
        </div>

        <div className="w-full bg-zinc-50 border border-zinc-200 p-10 rounded-xl col-span-3">
          <h3 className="text-lg text-zinc-700 font-bold">
            Comparaison avec un autre service cloud
          </h3>
        </div>

        <div className="w-full bg-zinc-50 border p-10 rounded-xl">
          <h3 className="text-lg text-zinc-800 font-bold">Cloud Provider</h3>
          <select
            value={cloudProviderBis}
            onChange={(e) =>
              handleProviderChangeBis(e.target.value as CloudProvider)
            }
            className="mt-2 w-full p-2 rounded border border-zinc-200"
          >
            <option value="AWS">AWS</option>
            <option value="GCP">GCP</option>
            <option value="Azure">Azure</option>
          </select>
        </div>
        <div className="w-full bg-zinc-50 border p-10 rounded-xl">
          <h3 className="text-lg text-zinc-800 font-bold">Region</h3>
          <select
            value={regionBis}
            onChange={(e) => setRegionBis(e.target.value)}
            className="mt-2 w-full p-2 rounded border border-zinc-200"
          >
            {REGIONS_BY_PROVIDER[cloudProviderBis].map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full bg-zinc-50 border border-zinc-200 p-10 rounded-xl col-span-1">
          <h3 className="text-lg text-zinc-700 font-bold">
            Consommation totale
          </h3>
          <span className="text-4xl font-black text-zinc-800 geist-mono">
            {totalImpact}
          </span>
          <span className="text-zinc-700 font-semibold text-lg">
            &nbsp;kWh / an
          </span>
          <br />
          <span className="text-zinc-600">
            soit&nbsp;
            <span className="font-semibold geist-mono">{co2ImpactBis} kgCO2e</span>
            &nbsp;émis par an
          </span>
        </div>

        <div className="w-full bg-zinc-50 border border-zinc-200 p-10 rounded-xl col-span-3">
          <h3 className="text-lg text-zinc-700 font-bold">
            Quelques chiffres de référence
          </h3>
          <span className="text-zinc-600">
            <span className="text-4xl font-black text-zinc-800 geist-mono">
              {co2Impact}
            </span>
            <span className="text-zinc-700 font-semibold text-lg">
              &nbsp;kgCO2e
            </span>
            <br />
            Cela correspond aux émissions carbones moyennes de &nbsp;
            <span className="font-semibold geist-mono">{individualReferenceImpact} habitants</span>
            &nbsp; en France chaque année.
          </span>
        </div>



      </div>



      <div className="mt-6 px-12 py-10 bg-zinc-50 rounded-xl border">
        <h3 className="text-lg font-bold text-zinc-700 mb-2">Sources</h3>
        <ul className="space-y-1">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 hover:underline"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
