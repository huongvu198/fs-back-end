import { config } from '../../config/app.config';
import { REGEX } from '../constants';

const { nodeEnv = '' } = config;

export const isProdEnv = (env = nodeEnv) => 'production' === env;

export const isDeployEnv = (env = nodeEnv) => {
  const deployEnvironments = ['development', 'staging', 'production'];
  return deployEnvironments.includes(env);
};

export const replaceQuerySearch = (search: string) => {
  return search.replace(REGEX.ESCAPE_SPECIAL_CHARS, '\\$&');
};
