import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
export type JwtPayload = {
    sub: string;
    matricule: string;
    role: string;
    schoolId: string | null;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        matricule: string;
        role: string;
        schoolId: string | null;
    }>;
}
export {};
