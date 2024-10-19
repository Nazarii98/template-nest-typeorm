// import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
// import { ErrorKey } from '@shared-kernel/common/enums/error-key.enum';
// import { CurrentUser } from '@shared-kernel/common/interface/current-user';
// import { ClaimVerifyResult } from '@shared-kernel/common/interface/token-validation/claim-verify-result.interface';
// import { TokenValidatorService } from '@shared-kernel/common/services/token-validation.service';
// import { NextFunction, Request, Response } from 'express';
// import { GetOrCreateUserByIdentifierUseCase } from '../../../components/user/application/usecases/external/get-or-create-user-by-identifier.usecase';
//
// @Injectable()
// export class TokenAuthMiddleware implements NestMiddleware {
//   constructor(
//     private getOrCreateUserByIdentifierUseCase: GetOrCreateUserByIdentifierUseCase,
//     private tokenValidatorService: TokenValidatorService,
//   ) {}
//
//   async use(req: Request, res: Response, next: NextFunction) {
//     const authorization = req.header('Authorization');
//
//     if (!authorization) {
//       throw new UnauthorizedException({
//         message: 'Authorization header is required!',
//         key: ErrorKey.authorization_header_required,
//       });
//     }
//
//     const token = authorization.split(' ')[1];
//
//     if (!token) {
//       throw new UnauthorizedException({
//         message: 'Authorization token is required!',
//         key: ErrorKey.authorization_token_required,
//       });
//     }
//
//     const claimVerifyResult: ClaimVerifyResult = await this.tokenValidatorService.validate(token);
//
//     if (claimVerifyResult && claimVerifyResult.isValid) {
//       const userInfo = await this.getOrCreateUserByIdentifierUseCase.execute(claimVerifyResult.userName);
//
//       const currentUser: CurrentUser = {
//         email: userInfo.email?.toLowerCase(),
//         id: userInfo.id,
//         role: userInfo.role,
//       };
//
//       req['currentUser'] = currentUser;
//
//       next();
//     } else {
//       throw new UnauthorizedException({
//         message: 'Token is not valid!',
//         key: ErrorKey.token_not_valid,
//       });
//     }
//   }
// }
