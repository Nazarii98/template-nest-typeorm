import {Injectable} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {CustomCronExpression} from '@shared-kernel/common/enums/custom-cron-expression.enum';


@Injectable()
export class TemplateCron {
    @Cron(CustomCronExpression.EVERY_15_MINUTES)
    public async handleCron() {
        console.log("Hello world")
    }

}
