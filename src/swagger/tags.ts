export enum ApiControllerTag {
  Organizations = 'organizations',
  Users = 'users',
  Pokemons = 'pokemons',
  Auth = 'auth',
}

export type ApiXConfig = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  type: any;
  operationId: string;
  summary: string;
  deprecated?: boolean;
};
