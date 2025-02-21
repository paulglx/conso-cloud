import {
  CO2_INTENSITY,
  GPU_MODELS,
  CloudProvider,
  REGIONS_BY_PROVIDER,
  Region,
} from "./Data";

import { roundToDecimals, formatUnit } from "./util";
import { useState } from "react";
import { Box, BoxInput, BoxConsumption } from "./Box";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

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
    name: "U.S. Environmental Protection Agency",
    url: "https://www.epa.gov/",
  },
  {
    name: "IPCC (Intergovernmental Panel on Climate Change)",
    url: "https://www.osti.gov/etdeweb/biblio/20880391",
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
  const [region, setRegion] = useState<Region>(REGIONS_BY_PROVIDER.AWS[0]);

  const [sourceValues, setSourceValues] = useState<Record<string, number>>({
    "Nombre de vCPUs": 0,
    "Utilisation moyenne des vCPUs": 0,
    "Stockage HDD": 0,
    "Stockage SSD": 0,
    "Transfert réseau": 0,
    Mémoire: 0,
  });

  const [selectedGpu, setSelectedGpu] = useState<string>(GPU_MODELS[0].name);
  const [gpuValues, setGpuValues] = useState<{
    units: number;
    utilization: number;
  }>({
    units: 0,
    utilization: 0,
  });

  /// Computations ///
  const HOURS_PER_YEAR = 8760;
  const MONTH_PER_YEAR = 12;

  // Impacts are in W/year.
  const hddImpact = sourceValues["Stockage HDD"] * 0.65 * HOURS_PER_YEAR;
  const ssdImpact = sourceValues["Stockage SSD"] * 1.2 * HOURS_PER_YEAR;
  const memoryImpact = sourceValues["Mémoire"] * 0.392 * HOURS_PER_YEAR;

  const cpuUtilization = sourceValues["Utilisation moyenne des vCPUs"] / 100;
  const cpuPower =
    CPU_POWER[cloudProvider].min +
    (CPU_POWER[cloudProvider].max - CPU_POWER[cloudProvider].min) *
      cpuUtilization;
  const cpuImpact = sourceValues["Nombre de vCPUs"] * cpuPower * HOURS_PER_YEAR;

  const networkImpact =
    sourceValues["Transfert réseau"] * 1000 * MONTH_PER_YEAR;

  const { units, utilization } = gpuValues;
  const gpuModel = GPU_MODELS.find((model) => model.name === selectedGpu);

  let gpuImpact = 0;
  if (gpuModel) {
    const power =
      gpuModel.idle + (gpuModel.max - gpuModel.idle) * (utilization / 100);
    gpuImpact = power * units * HOURS_PER_YEAR;
  }

  const totalElec: number = Number(
    roundToDecimals(
      (hddImpact +
        ssdImpact +
        cpuImpact +
        networkImpact +
        memoryImpact +
        gpuImpact) *
        PROVIDER_PUE[cloudProvider],
      1,
    ),
  );

  const co2Impact: number = Number(
    roundToDecimals(
      totalElec * CO2_INTENSITY[cloudProvider][region.id] * 1000,
      1,
    ),
  );
  /// End of computations ///

  const maxGpuIdle: number =
    GPU_MODELS.map((gpu) => gpu.idle).reduce((a, b) => a + b) /
    GPU_MODELS.length;

  const handleSourceChange = (title: string, value: number) => {
    setSourceValues((prev) => ({ ...prev, [title]: value }));
  };

  const handleProviderChange = (newProvider: CloudProvider) => {
    setCloudProvider(newProvider);
    setRegion(REGIONS_BY_PROVIDER[newProvider][0]);
  };

  const getIntensityColor = (
    value: number,
    min: number = 0,
    max: number = 1,
    higherIsBetter: boolean = false,
  ) => {
    // Normalize value between 0 and 1
    let normalizedValue = (value - min) / (max - min);

    // If higher values are worse, invert the scale
    if (!higherIsBetter) {
      normalizedValue = 1 - normalizedValue;
    }

    // Clamp between 0 and 1
    normalizedValue = Math.max(0, Math.min(1, normalizedValue));

    // Keep a consistent intensity level
    const level = 600;

    // For first third (0-0.33): green to yellow
    if (normalizedValue <= 0.33) {
      // Normalize within this range (0-0.33 becomes 0-1)
      const rangeValue = normalizedValue * 3;
      return rangeValue <= 0.5 ? `text-green-${level}` : `text-lime-${level}`;
    }
    // For middle third (0.34-0.66): yellow range
    else if (normalizedValue <= 0.66) {
      const rangeValue = (normalizedValue - 0.33) * 3;
      return rangeValue <= 0.5 ? `text-yellow-${level}` : `text-amber-${level}`;
    }
    // For final third (0.67-1.0): orange to red
    else {
      const rangeValue = (normalizedValue - 0.66) * 3;
      return rangeValue <= 0.5 ? `text-orange-${level}` : `text-red-${level}`;
    }
  };
  return (
    <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-24 my-6 md:my-24">
      <Box
        title="Calculateur de Consommation"
        className="px-6 sm:px-8 md:px-10 py-10"
      >
        <h2 className="text-lg font-semibold text-zinc-500">
          Quelle conso pour mon cloud ?
        </h2>
      </Box>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Box title="Cloud Provider">
          <Listbox
            value={cloudProvider}
            onChange={(cp: CloudProvider) => handleProviderChange(cp)}
            as="div"
            className="w-full py-2"
          >
            <ListboxButton className="bg-white px-3 py-1.5 border rounded w-full text-left">
              {cloudProvider}
            </ListboxButton>
            <ListboxOptions
              anchor="bottom start"
              className={`bg-white border rounded text-left min-w-56 z-20 [--anchor-gap:4px]`}
            >
              {["AWS", "GCP", "Azure"].map((cp) => (
                <ListboxOption
                  key={cp}
                  value={cp}
                  className={`cursor-pointer px-2 py-1 m-1 rounded hover:bg-gray-50 ${cp === cloudProvider ? "text-blue-600 bg-blue-50" : ""}`}
                >
                  {cp}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
          <div className="flex items-center justify-between">
            <span className="geist-mono">
              {PROVIDER_PUE[cloudProvider]} &nbsp;PUE
            </span>
          </div>
        </Box>

        <Box title="Region">
          <Listbox
            value={region}
            onChange={(r) => setRegion(r)}
            as="div"
            className="w-full py-2"
          >
            <ListboxButton className="bg-white px-3 py-1.5 border rounded w-full text-left">
              {region.name}
            </ListboxButton>
            <ListboxOptions
              anchor="bottom start"
              className={`bg-white border rounded text-left z-20 [--anchor-gap:4px]`}
            >
              {REGIONS_BY_PROVIDER[cloudProvider].map((r) => (
                <ListboxOption
                  key={r.id}
                  value={r}
                  className={`cursor-pointer px-2 py-1 m-1 rounded hover:bg-gray-50 ${r.id === region.id ? "text-blue-600 bg-blue-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    {r.name}
                    <span
                      className={`ms-4 rounded-full ${getIntensityColor(CO2_INTENSITY[cloudProvider][r.id] * 1000, 0, 1, true)}`}
                    >
                      <span className="text-xs geist-mono">
                        {roundToDecimals(
                          CO2_INTENSITY[cloudProvider][r.id] * 1000,
                          2,
                        )}
                      </span>
                      &nbsp;●
                    </span>
                  </div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
          <div className="flex items-center justify-between">
            <span className="geist-mono">
              {(CO2_INTENSITY[cloudProvider][region.id] * 1000).toFixed(2)}{" "}
              &nbsp;kgCO2e/kWh
            </span>
          </div>
        </Box>

        <Box title="CPUs">
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

        <Box title="GPUs">
          <Listbox
            value={selectedGpu}
            onChange={(gpu) => setSelectedGpu(gpu)}
            as="div"
            className="w-full py-2"
          >
            <ListboxButton className="bg-white px-3 py-1.5 border rounded w-full text-left">
              {selectedGpu}
            </ListboxButton>
            <ListboxOptions
              anchor="bottom start"
              className={`bg-white border rounded text-left z-20 [--anchor-gap:4px]`}
            >
              <div className="px-2 py-1 bg-gray-50 m-1 rounded text-gray-500 flex items-center justify-between">
                <span>GPU Model</span>
                <span className="text-xs">Power : Idle · Max</span>
              </div>
              {GPU_MODELS.map((gpu) => (
                <ListboxOption
                  key={gpu.name}
                  value={gpu.name}
                  className={`cursor-pointer px-2 py-1 m-1 rounded hover:bg-gray-50 ${gpu.name === selectedGpu ? "text-blue-600 bg-blue-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    {gpu.name}
                    <span
                      className={`ms-8 rounded-full ${getIntensityColor(gpu.idle, 0, maxGpuIdle, true)}`}
                    >
                      <span className="text-xs geist-mono">
                        {gpu.idle}W · {gpu.max}W
                      </span>
                    </span>
                  </div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>

          <BoxInput
            label={`Nombre`}
            value={gpuValues.units}
            unit="unités"
            min={0}
            max={5}
            onChange={(value) =>
              setGpuValues((prev) => ({ ...prev, units: value }))
            }
          />
          <BoxInput
            label={`Utilisation moyenne`}
            value={gpuValues.utilization}
            unit="%"
            min={0}
            max={100}
            onChange={(value) =>
              setGpuValues((prev) => ({ ...prev, utilization: value }))
            }
          />
          <BoxConsumption value={gpuImpact} />
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

        <Box title="Mémoire">
          <BoxInput
            label="Volume"
            value={sourceValues["Mémoire"]}
            unit="Gb"
            min={0}
            max={100}
            onChange={(value) => handleSourceChange("Mémoire", value)}
          />
          <BoxConsumption value={memoryImpact} />
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
          className="!bg-green-50 border-green-300 col-span-1 sm:col-span-2"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div>
              <span className="text-2xl md:text-4xl font-black text-green-800 geist-mono">
                {formatUnit(totalElec, "Wh/an", 1)}
              </span>
              <br />
              <span className=" text-green-600">
                soit&nbsp;
                <span className="font-semibold geist-mono">
                  {formatUnit(co2Impact, "CO2e", 1)}
                </span>
                &nbsp;émis par an
              </span>
            </div>

            {totalElec > 0 && (
              <div className="flex-1 w-full">
                <div className="h-6 flex rounded-full text-center overflow-hidden relative ring-4 ring-white">
                  {[
                    { value: cpuImpact, color: "bg-blue-200", label: "Calcul" },
                    { value: hddImpact, color: "bg-yellow-200", label: "HDD" },
                    { value: ssdImpact, color: "bg-orange-200", label: "SSD" },
                    {
                      value: networkImpact,
                      color: "bg-purple-200",
                      label: "Réseau",
                    },
                    {
                      value: memoryImpact,
                      color: "bg-green-200",
                      label: "Mémoire",
                    },
                    { value: gpuImpact, color: "bg-gray-200", label: "GPU" },
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

        <Box title="Équivalences" className="col-span-1 sm:col-span-2">
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
                Inclut la fabrication et l'usage. Pour les voitures, moyenne de
                2 personnes par véhicule.
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
                      className="flex flex-col items-center text-center p-4 bg-zinc-100 rounded-lg"
                    >
                      <div className="text-2xl mb-2">{country.icon}</div>
                      <div className="text-sm text-zinc-600">
                        {country.country}
                      </div>
                      <div className="font-bold text-lg mt-1">{equivalent}</div>
                      <div className="text-xs text-zinc-500">
                        ({country.emission}
                        <span className="hidden md:inline">
                          {" "}
                          TCO2e/personne/an
                        </span>
                        <span className="inline md:hidden"> TCO2e/per/an</span>)
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
        <ul className="space-y-1 mt-1">
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
