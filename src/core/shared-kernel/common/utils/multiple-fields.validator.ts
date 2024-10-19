import { BadRequestException, FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

export interface SingleFieldValidatorOptions {
  name: string;
  maxSize: number;
  mimeType: RegExp;
}

interface IMultipleFieldsValidatorOptions {
  fields: SingleFieldValidatorOptions[];
}

export class MultipleFieldsValidator<TFile extends IFile = IFile> extends FileValidator {
  constructor(validationOptions: IMultipleFieldsValidatorOptions) {
    super(validationOptions);
  }

  isValid(file?: TFile | TFile[] | Record<string, TFile[]>): boolean | Promise<boolean> {
    const errors = [];
    for (const validation of this.validationOptions.fields) {
      file[validation.name]?.map((item) => {
        if (!validation.mimeType.test(item.mimetype)) {
          errors.push(`Oops... ${item.originalname} has not supported type`);
        }

        if (validation.maxSize <= item.size) {
          errors.push(`Oops... ${item.originalname} is too big`);
        }
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return true;
  }

  buildErrorMessage(file: any): string {
    return 'Error';
  }
}
