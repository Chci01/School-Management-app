import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(schoolId: string | null, matricule: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            sub: any;
            matricule: any;
            role: any;
            schoolId: any;
        };
    }>;
}
