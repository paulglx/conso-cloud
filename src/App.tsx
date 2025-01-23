import { CO2_INTENSITY, CloudProvider, REGIONS_BY_PROVIDER } from "./Data";

import { roundToDecimals, formatUnit } from "./util";
import { useState } from "react";
import { Box, BoxInput, BoxConsumption } from "./Box";

const SOURCES = [
  {
    name: "Cloud Carbon Footprint",
    url: "https://www.cloudcarbonfootprint.org/docs/methodology",
  },
  {
    name: "Greenly",
    url: "https://greenly.earth/en-gb/blog/ecology-news/what-is-the-carbon-footprint-of-data-storage",
  },
  {
    name: "carbone4",
    url: "https://www.carbone4.com/en/analysis-faq-aviation-climate",
  },
  {
    name: "Our World In Data",
    url: "https://ourworldindata.org/food-choice-vs-eating-local",
  },
  {
    name: "Our World In Data",
    url: "https://ourworldindata.org/co2-emissions",
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
    max: 3.5,
  },
  GCP: {
    min: 0.71,
    max: 4.26,
  },
  Azure: {
    min: 0.78,
    max: 3.76,
  },
};

function App() {
  const [cloudProvider, setCloudProvider] = useState<CloudProvider>("AWS");
  const [region, setRegion] = useState<string>(REGIONS_BY_PROVIDER.AWS[0].id);

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
  const ssdImpact = sourceValues["Stockage SSD"] * 1.2 * HOURS_PER_YEAR;

  const cpuUtilization = sourceValues["Utilisation moyenne des vCPUs"] / 100;
  const cpuPower =
    CPU_POWER[cloudProvider].min +
    (CPU_POWER[cloudProvider].max - CPU_POWER[cloudProvider].min) *
      cpuUtilization;
  const cpuImpact = sourceValues["Nombre de vCPUs"] * cpuPower * HOURS_PER_YEAR;

  const networkImpact =
    sourceValues["Transfert réseau"] * 1000 * MONTH_PER_YEAR;

  const totalElec: number = roundToDecimals(
    (hddImpact + ssdImpact + cpuImpact + networkImpact) *
      PROVIDER_PUE[cloudProvider],
    1,
  );

  const co2Impact = roundToDecimals(
    totalElec * CO2_INTENSITY[cloudProvider][region] * 1000,
    1,
  );
  /// End of computations ///

  const handleSourceChange = (title: string, value: number) => {
    setSourceValues((prev) => ({ ...prev, [title]: value }));
  };

  const handleProviderChange = (newProvider: CloudProvider) => {
    setCloudProvider(newProvider);
    setRegion(REGIONS_BY_PROVIDER[newProvider][0].id);
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
            onChange={(e) =>
              handleProviderChange(e.target.value as CloudProvider)
            }
            className="mt-2 w-full p-2 rounded border border-zinc-200"
          >
            <option value="AWS">AWS</option>
            <option value="GCP">GCP</option>
            <option value="Azure">Azure</option>
          </select>
          <div className="flex items-center justify-between">
            <span className="geist-mono">
              {PROVIDER_PUE[cloudProvider]} &nbsp;PUE
            </span>
          </div>
        </Box>

        <Box title="Region">
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
          <div className="flex items-center justify-between">
            <span className="geist-mono">
              {(CO2_INTENSITY[cloudProvider][region] * 1000).toFixed(2)}{" "}
              &nbsp;kgCO2e/kWh
            </span>
          </div>
        </Box>

        <Box title="Calcul">
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
              onChange={(value) =>
                handleSourceChange("Utilisation moyenne des vCPUs", value)
              }
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

        <Box
          title="Consommation totale"
          className="bg-green-100 border-green-300 col-span-3"
        >
          <div className="flex items-center gap-8">
            <div>
              <span className="text-4xl font-black text-green-800 geist-mono">
                {formatUnit(totalElec, "Wh/an", 1)}
              </span>
              <br />
              <span className="text-green-600">
                soit&nbsp;
                <span className="font-semibold geist-mono">
                  {formatUnit(co2Impact, "CO2e", 1)}
                </span>
                &nbsp;émis par an
              </span>
            </div>

            {totalElec > 0 && (
              <div className="flex-1">
                <div className="h-6 flex rounded-full overflow-hidden relative ring-4 ring-white">
                  {[
                    { value: cpuImpact, color: "bg-blue-200", label: "Calcul" },
                    { value: hddImpact, color: "bg-yellow-200", label: "HDD" },
                    { value: ssdImpact, color: "bg-orange-200", label: "SSD" },
                    {
                      value: networkImpact,
                      color: "bg-purple-200",
                      label: "Réseau",
                    },
                  ].map((component, i) => {
                    const percentage =
                      (component.value * 100) /
                      (totalElec / PROVIDER_PUE[cloudProvider]);
                    if (percentage < 1) return null;
                    return (
                      <div
                        key={i}
                        className={`${component.color} h-full flex items-center justify-center text-xs font-medium relative`}
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage >= 10 && (
                          <span className="text-black z-10">
                            {component.label} {roundToDecimals(percentage, 1)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Box>

        <Box title="Équivalences" className="col-span-3">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Transports</h4>
              <div className="grid grid-cols-4 gap-4">
                {/* in g CO2eq / km */}
                {[
                  { mode: "Voiture diesel", emission: 109, icon: "🚗" },
                  { mode: "Voiture électrique", emission: 51, icon: "🔌" },
                  { mode: "Avion", emission: 264, icon: "✈️" },
                  { mode: "TGV", emission: 10, icon: "🚄" },
                ].map((transport) => {
                  const kmEquivalent = roundToDecimals(
                    co2Impact / transport.emission,
                    0,
                  );
                  return (
                    <div
                      key={transport.mode}
                      className="text-center p-4 bg-zinc-100 rounded-lg"
                    >
                      <div className="text-2xl mb-2">{transport.icon}</div>
                      <div className="text-sm text-zinc-600">
                        {transport.mode}
                      </div>
                      <div className="font-bold text-lg mt-1">
                        {kmEquivalent} km
                      </div>
                      <div className="text-xs text-zinc-500">
                        ({transport.emission} gCO2e/km)
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                * Inclut la fabrication et l'usage. Pour les voitures, moyenne
                de 2 personnes par véhicule.
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Alimentation</h4>
              <div className="grid grid-cols-4 gap-4">
                {/* in kg CO2eq / kg */}
                {[
                  { mode: "Boeuf", emission: 60, icon: "🥩" },
                  { mode: "Agneau", emission: 24, icon: "🐑" },
                  { mode: "Poulet", emission: 6, icon: "🍗" },
                  { mode: "Pommes", emission: 0.4, icon: "🍎" },
                ].map((food) => {
                  const kgEquivalent = roundToDecimals(
                    co2Impact / (food.emission * 1000),
                    1,
                  );
                  return (
                    <div
                      key={food.mode}
                      className="text-center p-4 bg-zinc-100 rounded-lg"
                    >
                      <div className="text-2xl mb-2">{food.icon}</div>
                      <div className="text-sm text-zinc-600">{food.mode}</div>
                      <div className="font-bold text-lg mt-1">
                        {kgEquivalent} kg
                      </div>
                      <div className="text-xs text-zinc-500">
                        ({food.emission} kgCO2e/kg)
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Inclut la production, transformation et transport.
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">
                Émissions de CO2 par personne
              </h4>
              <div className="grid grid-cols-4 gap-4">
                {/* in T CO2eq / year */}
                {[
                  { country: "UE", emission: 5.6, icon: "🇪🇺" },
                  { country: "USA", emission: 14.3, icon: "🇺🇸" },
                  { country: "Kenya", emission: 0.4, icon: "🇰🇪" },
                  { country: "Inde", emission: 2.1, icon: "🇮🇳" },
                ].map((country) => {
                  const equivalent = roundToDecimals(
                    co2Impact / (country.emission * 1000 * 1000),
                    3,
                  );
                  return (
                    <div
                      key={country.country}
                      className="text-center p-4 bg-zinc-100 rounded-lg"
                    >
                      <div className="text-2xl mb-2">{country.icon}</div>
                      <div className="text-sm text-zinc-600">
                        {country.country}
                      </div>
                      <div className="font-bold text-lg mt-1">{equivalent}</div>
                      <div className="text-xs text-zinc-500">
                        ({country.emission} TCO2e/personne/an)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Box>
      </div>

      <Box title="Sources" className="mt-6">
        <ul className="space-y-2">
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
      </Box>
    </div>
  );
}

export default App;
