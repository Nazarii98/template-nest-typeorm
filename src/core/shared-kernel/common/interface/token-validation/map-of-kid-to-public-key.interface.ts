import { PublicKeyMeta } from './public-key-meta.interface';

export interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}
