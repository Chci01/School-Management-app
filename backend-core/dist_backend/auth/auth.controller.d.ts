import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
        user: {
            sub: any;
            matricule: any;
            role: any;
            schoolId: any;
        };
    }>;
}
