export type ProviderContractRule =
  | "create-provider-execution-log"
  | "validate-runtime-output"
  | "mock-only-v1"
  | "store-provider-identifiers"
  | "exclude-secrets";

export const providerContractRules: ProviderContractRule[] = [
  "create-provider-execution-log",
  "validate-runtime-output",
  "mock-only-v1",
  "store-provider-identifiers",
  "exclude-secrets",
];
