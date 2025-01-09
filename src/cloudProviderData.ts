export type CloudProvider = 'AWS' | 'GCP' | 'Azure';

type Region = {
  id: string;
  name: string;
};

export const REGIONS_BY_PROVIDER: Record<CloudProvider, Region[]> = {
  AWS: [
    { id: 'us-east-1', name: 'US East (N. Virginia)' },
    { id: 'us-east-2', name: 'US East (Ohio)' },
    { id: 'us-west-1', name: 'US West (N. California)' },
    { id: 'us-west-2', name: 'US West (Oregon)' },
    { id: 'af-south-1', name: 'Africa (Cape Town)' },
    { id: 'ap-east-1', name: 'Asia Pacific (Hong Kong)' },
    { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
    { id: 'ap-northeast-3', name: 'Asia Pacific (Osaka)' },
    { id: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
    { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
    { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
    { id: 'ca-central-1', name: 'Canada (Central)' },
    { id: 'eu-central-1', name: 'Europe (Frankfurt)' },
    { id: 'eu-west-1', name: 'Europe (Ireland)' },
    { id: 'eu-west-2', name: 'Europe (London)' },
    { id: 'eu-south-1', name: 'Europe (Milan)' },
    { id: 'eu-west-3', name: 'Europe (Paris)' },
    { id: 'eu-north-1', name: 'Europe (Stockholm)' },
    { id: 'me-south-1', name: 'Middle East (Bahrain)' },
    { id: 'sa-east-1', name: 'South America (São Paulo)' },
  ],
  GCP: [
    { id: 'us-central1', name: 'us-central1 (Iowa)' },
    { id: 'us-east1', name: 'us-east1 (South Carolina)' },
    { id: 'us-east4', name: 'us-east4 (Northern Virginia)' },
    { id: 'us-west1', name: 'us-west1 (Oregon)' },
    { id: 'us-west2', name: 'us-west2 (Los Angeles)' },
    { id: 'us-west3', name: 'us-west3 (Salt Lake City)' },
    { id: 'us-west4', name: 'us-west4 (Las Vegas)' },
    { id: 'asia-east1', name: 'asia-east1 (Taiwan)' },
    { id: 'asia-east2', name: 'asia-east2 (Hong Kong)' },
    { id: 'asia-northeast1', name: 'asia-northeast1 (Tokyo)' },
    { id: 'asia-northeast2', name: 'asia-northeast2 (Osaka)' },
    { id: 'asia-northeast3', name: 'asia-northeast3 (Seoul)' },
    { id: 'asia-south1', name: 'asia-south1 (Mumbai)' },
    { id: 'asia-south2', name: 'asia-south2 (Delhi)' },
    { id: 'asia-southeast1', name: 'asia-southeast1 (Singapore)' },
    { id: 'asia-southeast2', name: 'asia-southeast2 (Jakarta)' },
    { id: 'australia-southeast1', name: 'australia-southeast1 (Sydney)' },
    { id: 'australia-southeast2', name: 'australia-southeast2 (Melbourne)' },
    { id: 'europe-central2', name: 'europe-central2 (Warsaw)' },
    { id: 'europe-north1', name: 'europe-north1 (Finland)' },
    { id: 'europe-west1', name: 'europe-west1 (Belgium)' },
    { id: 'europe-west2', name: 'europe-west2 (London)' },
    { id: 'europe-west3', name: 'europe-west3 (Frankfurt)' },
    { id: 'europe-west4', name: 'europe-west4 (Netherlands)' },
    { id: 'europe-west6', name: 'europe-west6 (Zurich)' },
    { id: 'northamerica-northeast1', name: 'northamerica-northeast1 (Montreal)' },
    { id: 'southamerica-east1', name: 'southamerica-east1 (Sao Paulo)' }
  ],
  Azure: [
    { id: 'central-us', name: 'Central US (Iowa)' },
    { id: 'east-us', name: 'East US (Virginia)' },
    { id: 'east-us-2', name: 'East US 2 (Virginia)' },
    { id: 'east-us-3', name: 'East US 3 (Georgia)' },
    { id: 'north-central-us', name: 'North Central US (Illinois)' },
    { id: 'south-central-us', name: 'South Central US (Texas)' },
    { id: 'west-central-us', name: 'West Central US (Wyoming)' },
    { id: 'west-us', name: 'West US (California)' },
    { id: 'west-us-2', name: 'West US 2 (Washington)' },
    { id: 'west-us-3', name: 'West US 3 (Arizona)' },
    { id: 'east-asia', name: 'East Asia (Hong Kong)' },
    { id: 'southeast-asia', name: 'Southeast Asia (Singapore)' },
    { id: 'south-africa-north', name: 'South Africa North (Johannesburg)' },
    { id: 'south-africa-west', name: 'South Africa West (South Africa)' },
    { id: 'south-africa', name: 'South Africa (South Africa)' },
    { id: 'australia', name: 'Australia (Australia)' },
    { id: 'australia-central', name: 'Australia Central (Canberra)' },
    { id: 'australia-central-2', name: 'Australia Central 2 (Canberra)' },
    { id: 'australia-east', name: 'Australia East (New South Wales)' },
    { id: 'australia-south-east', name: 'Australia South East (Victoria)' },
    { id: 'japan', name: 'Japan (Japan)' },
    { id: 'japan-west', name: 'Japan West (Osaka)' },
    { id: 'japan-east', name: 'Japan East (Tokyo, Saitama)' },
    { id: 'korea', name: 'Korea (Korea)' },
    { id: 'korea-east', name: 'Korea East (Korea)' },
    { id: 'korea-south', name: 'Korea South (Korea)' },
    { id: 'india', name: 'India (India)' },
    { id: 'india-west', name: 'India West (Mumbai)' },
    { id: 'india-central', name: 'India Central (Pune)' },
    { id: 'india-south', name: 'India South (Chennai)' },
    { id: 'north-europe', name: 'North Europe (Ireland)' },
    { id: 'west-europe', name: 'West Europe (Netherlands)' },
    { id: 'france', name: 'France (France)' },
    { id: 'france-central', name: 'France Central (Paris)' },
    { id: 'france-south', name: 'France South (France)' },
    { id: 'sweden-central', name: 'Sweden Central (Gävle and Sandviken)' },
    { id: 'switzerland', name: 'Switzerland (Switzerland)' },
    { id: 'switzerland-north', name: 'Switzerland North (Zürich)' },
    { id: 'switzerland-west', name: 'Switzerland West (Switzerland)' },
    { id: 'uk', name: 'UK (United Kingdom)' },
    { id: 'uk-south', name: 'UK South (London)' },
    { id: 'uk-west', name: 'UK West (Cardiff)' },
    { id: 'germany', name: 'Germany (Germany)' },
    { id: 'germany-north', name: 'Germany North (Germany)' },
    { id: 'germany-west-central', name: 'Germany West Central (Frankfurt)' },
    { id: 'norway', name: 'Norway (Norway)' },
    { id: 'norway-east', name: 'Norway East (Oslo)' },
    { id: 'norway-west', name: 'Norway West (Norway)' },
    { id: 'united-arab-emirates', name: 'United Arab Emirates (United Arab Emirates)' },
    { id: 'united-arab-emirates-north', name: 'United Arab Emirates North (Dubai)' },
    { id: 'united-arab-emirates-central', name: 'United Arab Emirates Central (United Arab Emirates)' },
    { id: 'canada', name: 'Canada (Canada)' },
    { id: 'canada-central', name: 'Canada Central (Toronto)' },
    { id: 'canada-east', name: 'Canada East (Quebec City)' },
    { id: 'brazil', name: 'Brazil (Brazil)' },
    { id: 'brazil-south', name: 'Brazil South (São Paulo State)' },
    { id: 'brazil-south-east', name: 'Brazil South East (Brazil)' }
  ],
};

export const CO2_INTENSITY: Record<CloudProvider, Record<string, number>> = {
  AWS: {
    'us-east-1': 0.000379069,
    'us-east-2': 0.000410608,
    'us-west-1': 0.000322167,
    'us-west-2': 0.000322167,
    'af-south-1': 0.0009006,
    'ap-east-1': 0.00071,
    'ap-south-1': 0.0007082,
    'ap-northeast-3': 0.0004658,
    'ap-northeast-2': 0.0004156,
    'ap-southeast-1': 0.000408,
    'ap-southeast-2': 0.00076,
    'ap-northeast-1': 0.0004658,
    'ca-central-1': 0.00012,
    'eu-central-1': 0.000311,
    'eu-west-1': 0.0002786,
    'eu-west-2': 0.000225,
    'eu-south-1': 0.0002134,
    'eu-west-3': 0.0000511,
    'eu-north-1': 0.0000088,
    'me-south-1': 0.0005059,
    'sa-east-1': 0.0000617,
  },
  GCP: {
    'us-central1': 0.000454,
    'us-east1': 0.00048,
    'us-east4': 0.000361,
    'us-west1': 0.000078,
    'us-west2': 0.000253,
    'us-west3': 0.000533,
    'us-west4': 0.000455,
    'asia-east1': 0.00054,
    'asia-east2': 0.000453,
    'asia-northeast1': 0.000554,
    'asia-northeast2': 0.000442,
    'asia-northeast3': 0.000457,
    'asia-south1': 0.000721,
    'asia-south2': 0.000657,
    'asia-southeast1': 0.000493,
    'asia-southeast2': 0.000647,
    'australia-southeast1': 0.000727,
    'australia-southeast2': 0.000691,
    'europe-central2': 0.000622,
    'europe-north1': 0.000133,
    'europe-west1': 0.000212,
    'europe-west2': 0.000231,
    'europe-west3': 0.000293,
    'europe-west4': 0.00041,
    'europe-west6': 0.000087,
    'northamerica-northeast1': 0.000027,
    'southamerica-east1': 0.000103
  },
  Azure: {
    'central-us': 0.000426254,
    'east-us': 0.000379069,
    'east-us-2': 0.000379069,
    'east-us-3': 0.000379069,
    'north-central-us': 0.000410608,
    'south-central-us': 0.000373231,
    'west-central-us': 0.000322167,
    'west-us': 0.000322167,
    'west-us-2': 0.000322167,
    'west-us-3': 0.000322167,
    'east-asia': 0.00071,
    'southeast-asia': 0.000408,
    'south-africa-north': 0.0009006,
    'south-africa-west': 0.0009006,
    'south-africa': 0.0009006,
    'australia': 0.00079,
    'australia-central': 0.00079,
    'australia-central-2': 0.00079,
    'australia-east': 0.00079,
    'australia-south-east': 0.00096,
    'japan': 0.0004658,
    'japan-west': 0.0004658,
    'japan-east': 0.0004658,
    'korea': 0.0004156,
    'korea-east': 0.0004156,
    'korea-south': 0.0004156,
    'india': 0.0007082,
    'india-west': 0.0007082,
    'india-central': 0.0007082,
    'india-south': 0.0007082,
    'north-europe': 0.0002786,
    'west-europe': 0.0003284,
    'france': 0.00005128,
    'france-central': 0.00005128,
    'france-south': 0.00005128,
    'sweden-central': 0.00000567,
    'switzerland': 0.00000567,
    'switzerland-north': 0.00000567,
    'switzerland-west': 0.00000567,
    'uk': 0.000225,
    'uk-south': 0.000225,
    'uk-west': 0.000228,
    'germany': 0.00033866,
    'germany-north': 0.00033866,
    'germany-west-central': 0.00033866,
    'norway': 0.00000762,
    'norway-east': 0.00000762,
    'norway-west': 0.00000762,
    'united-arab-emirates': 0.0004041,
    'united-arab-emirates-north': 0.0004041,
    'united-arab-emirates-central': 0.0004041,
    'canada': 0.00012,
    'canada-central': 0.00012,
    'canada-east': 0.00012,
    'brazil': 0.0000617,
    'brazil-south': 0.0000617,
    'brazil-south-east': 0.0000617
  },
}; 
