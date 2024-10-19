import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags} from '@nestjs/swagger';
import {TemplateUseCase} from "../application/usecases/template.usecase";

@ApiTags('Template')
@ApiBearerAuth('access_token')
@Controller('template')
export class TemplateController {
    constructor(
        private readonly templateUseCase: TemplateUseCase,
    ) {
    }

    @ApiOperation({summary: 'Get user communities'})
    @Get(":name")
    public async getUserCommunities(
        @Param("name") name: string
    ): Promise<any> {
        return this.templateUseCase.execute({name: "Hello"});
    }

}
