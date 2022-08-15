import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

interface ExtendedRequests extends Request {
  currentUser?: User;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}
  async use(req: ExtendedRequests, res: Response, next: NextFunction) {
    const { userId } = (req.session as any) || {};
    if (userId) {
      const user = await this.userService.findOne(userId);

      req.currentUser = user;
    }
    next();
  }
}
