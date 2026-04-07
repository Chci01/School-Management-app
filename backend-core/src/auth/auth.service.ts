import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(schoolId: string | null, identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findByMatricule(schoolId, identifier);
    if (!user) {
       console.log(`[AUTH DEBUG] User not found with ID ${identifier} in school ${schoolId}`);
       return null;
    }
    
    const isMatch = await bcrypt.compare(pass, user.password);
    console.log(`[AUTH DEBUG] Bcrypt match for ${pass} against stored hash: ${isMatch}`);
    
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      matricule: user.matricule,
      role: user.role,
      schoolId: user.schoolId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
