import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config({ path: './.env' });

export interface PaginationConfig {
  defaultPageSize: number;
  defaultPageNumber: number;
}

export interface ServerConfig {
  environment: string;
}

export interface S3Config {
  privateBucket: string;
  publicBucket: string;
}

export interface CognitoConfig {
  userPoolId: string;
  clientId: string;
}

export interface AWSConfig {
  defaultRegion: string;
  accessKey: string;
  accessSecret: string;
  s3: S3Config;
  cognito: CognitoConfig;
}

export interface ArgonConfig {
  secret: string;
}

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
}

export interface OpenAIConfig {
  secret: string;
}

export interface SendgridConfig {
  apiKey: string;
}

export interface AppleConfig {
  bundleId: string;
}

export interface Configuration {
  server: ServerConfig;
  aws: AWSConfig;
  pagination: PaginationConfig;
  argon: ArgonConfig;
  apple: AppleConfig;
  jwt: JwtConfig;
  openai: OpenAIConfig;
  sendgrid: SendgridConfig;
}

function configure(): Configuration {
  return {
    server: {
      environment: process.env.NODE_ENV,
    },
    aws: {
      defaultRegion: process.env.AWS_DEFAULT_REGION,
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      accessSecret: process.env.AWS_ACCESS_KEY_SECRET,
      s3: {
        privateBucket: process.env.AWS_S3_PRIVATE_BUCKET,
        publicBucket: process.env.AWS_S3_PUBLIC_BUCKET,
      },
      cognito: {
        userPoolId: process.env.AWS_COGNITO_POOL,
        clientId: process.env.AWS_COGNITO_CLIENT,
      },
    },
    pagination: {
      defaultPageSize: 10,
      defaultPageNumber: 1,
    },
    argon: {
      secret: process.env.PASSWORD_SECRET,
    },
    apple: {
      bundleId: process.env.APPLE_BUNDLE_ID,
    },
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
    },
    openai: {
      secret: process.env.OPENAI_SECRET,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
  };
}

export const Configuration: Configuration = configure();
