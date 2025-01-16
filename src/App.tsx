import {
  CO2_INTENSITY,
  CloudProvider,
  REGIONS_BY_PROVIDER,
} from "./Data";

import { roundToDecimals, formatUnit } from "./util";
import { useState } from "react";
import { Box, BoxInput, BoxConsumption } from './Box';

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


const PROVIDER_PUE: Record<CloudProvider, number> = {
  AWS: 1.135,
  GCP: 1.1,
  Azure: 1.185,
};

// kW
const CPU_POWER: Record<CloudProvider, { min: number; max: number }> = {
  AWS: {
    min: 0.74,
    max: 3.50
  },
  GCP: {
    min: 0.71,
    max: 4.26
  },
  Azure: {
    min: 0.78,
    max: 3.76
  }
};

function App() {
  const [cloudProvider, setCloudProvider] = useState<CloudProvider>("AWS");
  const [region, setRegion] = useState<string>(REGIONS_BY_PROVIDER.AWS[0].id);

  const [cloudProviderBis, setCloudProviderBis] = useState<CloudProvider>("AWS");
  const [regionBis, setRegionBis] = useState<string>(REGIONS_BY_PROVIDER.AWS[0].id);

  const [sourceValues, setSourceValues] = useState<Record<string, number>>({
    "Nombre de vCPUs": 0,
    "Utilisation moyenne des vCPUs": 0,
    "Stockage HDD": 0,
    "Stockage SSD": 0,
    "Transfert réseau": 0,
  });

  /// Computations /// 
  const HOURS_PER_YEAR = 8760;
  const MONTH_PER_YEAR = 12;

  // Impacts are in W/year.
  const hddImpact = sourceValues["Stockage HDD"] * 0.65 * HOURS_PER_YEAR;
  const ssdImpact = sourceValues["Stockage SSD"] * 1.20 * HOURS_PER_YEAR;

  const cpuUtilization = sourceValues["Utilisation moyenne des vCPUs"] / 100;
  const cpuPower = CPU_POWER[cloudProvider].min + (CPU_POWER[cloudProvider].max - CPU_POWER[cloudProvider].min) * cpuUtilization;
  const cpuImpact = sourceValues["Nombre de vCPUs"] * cpuPower * HOURS_PER_YEAR;

  const cpuPowerBis = CPU_POWER[cloudProviderBis].min + (CPU_POWER[cloudProviderBis].max - CPU_POWER[cloudProviderBis].min) * cpuUtilization;
  const cpuImpactBis = sourceValues["Nombre de vCPUs"] * cpuPowerBis * HOURS_PER_YEAR;

  const networkImpact = sourceValues["Transfert réseau"] * 1000 * MONTH_PER_YEAR;

  const totalElec: number = roundToDecimals(
    (hddImpact + ssdImpact + cpuImpact + networkImpact) * PROVIDER_PUE[cloudProvider],
    1
  );

  const totalElecBis: number = roundToDecimals(
    (hddImpact + ssdImpact + cpuImpactBis + networkImpact) * PROVIDER_PUE[cloudProviderBis],
    1
  );

  const co2Impact = roundToDecimals(
    totalElec * CO2_INTENSITY[cloudProvider][region] * 1000,
    1
  );
  /// End of computations ///

  const co2ImpactBis = roundToDecimals(
    totalElecBis * CO2_INTENSITY[cloudProviderBis][regionBis] * 1000,
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

      <Box title="Calculateur de Consommation" className="px-12 py-10">
        <h2 className="text-lg font-semibold text-zinc-500">
          Quelle conso pour mon cloud ?
        </h2>
      </Box>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <Box title="Cloud Provider">
          <select
            value={cloudProvider}
            onChange={(e) => handleProviderChange(e.target.value as CloudProvider)}
            className="mt-2 w-full p-2 rounded border border-zinc-200"
          >
            <option value="AWS">AWS</option>
            <option value="GCP">GCP</option>
            <option value="Azure">Azure</option>
          </select>
          <div className="flex items-center justify-between">
            <span className="geist-mono">{PROVIDER_PUE[cloudProvider]} &nbsp;PUE</span>
          </div>
        </Box>

        <Box title="Region">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-2 w-full p-2 rounded border border-zinc-200"
          >
            {REGIONS_BY_PROVIDER[cloudProvider].map((region) => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
          <div className="flex items-center justify-between">
            <span className="geist-mono">
              {(CO2_INTENSITY[cloudProvider][region] * 1000).toFixed(2)} &nbsp;kgCO2e/kWh
            </span>
          </div>
        </Box>

        <Box title="Compute">
          <div className="space-y-6">
            <BoxInput
              label="Nombre"
              value={sourceValues["Nombre de vCPUs"]}
              unit="vCPUs"
              min={0}
              max={20}
              onChange={(value) => handleSourceChange("Nombre de vCPUs", value)}
            />
            <BoxInput
              label="Utilisation moyenne"
              value={sourceValues["Utilisation moyenne des vCPUs"]}
              unit="%"
              min={0}
              max={100}
              onChange={(value) => handleSourceChange("Utilisation moyenne des vCPUs", value)}
            />
          </div>
          <BoxConsumption value={cpuImpact} />
        </Box>

        <Box title="Stockage HDD">
          <BoxInput
            label="Volume"
            value={sourceValues["Stockage HDD"]}
            unit="Tb"
            min={0}
            max={100}
            onChange={(value) => handleSourceChange("Stockage HDD", value)}
          />
          <BoxConsumption value={hddImpact} />
        </Box>

        <Box title="Stockage SSD">
          <BoxInput
            label="Volume"
            value={sourceValues["Stockage SSD"]}
            unit="Tb"
            min={0}
            max={100}
            onChange={(value) => handleSourceChange("Stockage SSD", value)}
          />
          <BoxConsumption value={ssdImpact} />
        </Box>

        <Box title="Réseau">
          <BoxInput
            label="Transfert"
            value={sourceValues["Transfert réseau"]}
            unit="Tb/mois"
            min={0}
            max={100}
            onChange={(value) => handleSourceChange("Transfert réseau", value)}
          />
          <BoxConsumption value={networkImpact} />
        </Box>

        <Box title="Consommation totale" className="bg-green-50 border-green-200 col-span-3">
          <span className="text-4xl font-black text-green-800 geist-mono">
            {formatUnit(totalElec, 'Wh/an', 1)}
          </span>
          <br />
          <span className="text-green-600">
            soit&nbsp;
            <span className="font-semibold geist-mono">
              {formatUnit(co2Impact, 'CO2e', 1)}
            </span>
            &nbsp;émis par an
          </span>
        </Box>
      </div>

      <div className="w-full bg-zinc-50 border border-zinc-200 p-10 mt-6 rounded-xl col-span-3">
        <h3 className="text-lg text-zinc-700 font-bold">
          Comparaison avec un autre service cloud
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
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

        <Box title="Consommation totale" className="bg-zinc-50 border-zinc-200 col-span-1">
          <span className="text-4xl font-black text-zinc-800 geist-mono">
            {formatUnit(totalElecBis, 'Wh/an', 1)}
          </span>
          <br />
          <span className="text-zinc-600">
            soit&nbsp;
            <span className="font-semibold geist-mono">
              {formatUnit(co2ImpactBis, 'CO2e', 1)}
            </span>
            &nbsp;émis par an
          </span>
        </Box>
      </div>


      <div className="w-full bg-zinc-50 border border-zinc-200 p-10 mt-6 rounded-xl col-span-3">
        <h3 className="text-lg text-zinc-700 font-bold">
          Quelques chiffres de référence
        </h3>
        <span className="text-zinc-600">
          <span className="text-4xl font-black text-zinc-800 geist-mono">
            {formatUnit(co2Impact, 'CO2e', 1)}
          </span>
          <span className="text-zinc-700 font-semibold text-lg">
            &nbsp;
          </span>
          <br />
          Cela correspond aux émissions carbones moyennes de &nbsp;
          <span className="font-semibold geist-mono">{individualReferenceImpact} habitants</span>
          &nbsp; en France chaque année.
        </span>
      </div>


      <Box title="Sources" className="mt-6">
        <ul className="space-y-2">
          {SOURCES.map(source => (
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
      </Box>

    </div >
  );
}

export default App;
