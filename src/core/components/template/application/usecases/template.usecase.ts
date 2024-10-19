import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared-kernel/common/interface/usecase';

export interface TemplateUseCaseParams {
  name: string;
}

@Injectable()
export class TemplateUseCase implements UseCase<TemplateUseCaseParams, void> {
  constructor(
  ) {}

  public async execute(params: TemplateUseCaseParams): Promise<void> {
  }
}
