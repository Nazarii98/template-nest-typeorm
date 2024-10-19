import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Claim } from '@shared-kernel/common/interface/token-validation/claim.interface';
import { PublicKeys } from '@shared-kernel/common/interface/token-validation/public-key.interface';
import { TokenHeader } from '@shared-kernel/common/interface/token-validation/token-header.interface';
import * as axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { promisify } from 'util';
import { ClaimVerifyResult } from '../interface/token-validation/claim-verify-result.interface';
import { MapOfKidToPublicKey } from '../interface/token-validation/map-of-kid-to-public-key.interface';

const verifyPromised = promisify(jwt.verify.bind(jwt));

@Injectable()
export class TokenValidatorService implements OnModuleInit {
  private readonly cognitoIssuer: string;
  private readonly logger = new Logger(TokenValidatorService.name);

  private cacheKeys: MapOfKidToPublicKey | undefined;

  constructor(private config: ConfigService) {
    this.cognitoIssuer = `https://cognito-idp.${this.config.get('aws').defaultRegion}.amazonaws.com/${
      this.config.get('cognito').userPoolId
    }`;
  }

  async onModuleInit() {
    this.logger.log('Fetching Cognito keys on module init');
    await this.getPublicKeys();
  }

  private async handler(token: string): Promise<ClaimVerifyResult> {
    let result: ClaimVerifyResult;
    try {
      const tokenSections = (token || '').split('.');

      if (tokenSections.length < 2) {
        throw new Error('requested token is invalid');
      }

      const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
      const header = JSON.parse(headerJSON) as TokenHeader;

      const keys = await this.getPublicKeys();
      const key = keys[header.kid];

      if (key === undefined) {
        throw new Error('claim made for unknown kid');
      }

      const claim = (await verifyPromised(token, key.pem)) as Claim;
      const currentSeconds = Math.floor(new Date().valueOf() / 1000);

      if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
        throw new Error('claim is expired or invalid');
      }

      if (claim.iss !== this.cognitoIssuer) {
        throw new Error('claim issuer is invalid');
      }

      if (claim.token_use !== 'access') {
        throw new Error('claim use is not access');
      }

      result = {
        userName: claim.username,
        clientId: claim.client_id,
        isValid: true,
      };
    } catch (error) {
      result = { userName: '', clientId: '', error, isValid: false };
    }
    return result;
  }

  private async getPublicKeys(): Promise<MapOfKidToPublicKey> {
    if (!this.cacheKeys) {
      this.logger.log('Fetching Cognito keys because cache is empty');
      const url = `${this.cognitoIssuer}/.well-known/jwks.json`;
      const publicKeys = await axios.get<PublicKeys>(url);
      this.cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
        const pem = jwkToPem(current);
        agg[current.kid] = { instance: current, pem };
        return agg;
      }, {} as MapOfKidToPublicKey);
      return this.cacheKeys;
    } else {
      return this.cacheKeys;
    }
  }

  async validate(token: string): Promise<ClaimVerifyResult> {
    return this.handler(token);
  }
}
