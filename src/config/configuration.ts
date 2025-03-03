import { config } from 'dotenv';
config();

export default () =>
  ({
    envFilePath: process.env.ENV_FILE,
    port: parseInt(process.env.PORT, 10) ?? 4000,
    database: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    },
    jwt: {
      secret_key: process.env.JWT_SECRET_KEY,
      expiration_duration: process.env.JWT_EXPIRATION_DURATION,
    },
    pokemon: {
      api: process.env.POKEMON_API,
      image_base_url: process.env.POKEMON_IMAGE_BASE_URL,
    },
  }) as {
    envFilePath?: string;
    port?: number;
    domainUrl?: string;
    database?: {
      host?: string;
      port?: number;
      username?: string;
      password?: string;
      name?: string;
    };
    jwt?: {
      secret_key?: string;
      expiration_duration?: string;
    };
    pokemon?: {
      api?: string;
      image_base_url?: string;
    };
  };
