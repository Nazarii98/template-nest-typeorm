import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { GlobalExceptionsFilter } from '@shared-kernel/primary-adapters/exception-filters/global-exception-filter';
import { LogRequestMiddleware } from '@shared-kernel/rest/middleware/log-request.middleware';
import PostgresConnectionModule from "@shared-kernel/secondary-adapters/postgres/postgres-connection.module";
import {validationSchema} from "./core/configuration/validation";
import {Configuration} from "./core/configuration/config";

const healthRoute = { path: 'health', method: RequestMethod.GET };

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [() => Configuration],
      validationSchema,
    }),
    ScheduleModule.forRoot(),
    PostgresConnectionModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestMiddleware).exclude(healthRoute).forRoutes('*');
  }
}
