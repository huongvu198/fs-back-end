import { MaybeType } from '../types/maybe.type';

export const lowerCaseTransformer = (value: string): MaybeType<string> =>
  (value || '').toLowerCase().trim();
