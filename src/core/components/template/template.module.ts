import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TemplateRepositoryType} from "./ports/template-repository.port";
import {TemplateRepositoryAdapter} from "./secondary-adapters/postgres/repository/template-repository.adapter";
import {TemplateEntity} from "./secondary-adapters/postgres/data/template.entity";
import {TemplateController} from "./primary-adapters/template.controller";
import {TemplateCron} from "./secondary-adapters/cron/template.cron";
import {TemplateUseCase} from "./application/usecases/template.usecase";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TemplateEntity,])
    ],
    controllers: [
        TemplateController,
    ],
    providers: [
        TemplateUseCase,

        TemplateCron,

        {provide: TemplateRepositoryType, useClass: TemplateRepositoryAdapter},

    ],
    exports: [TemplateUseCase],
})
export class TemplateModule {
}
