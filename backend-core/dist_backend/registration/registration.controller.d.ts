import { RegistrationService } from './registration.service';
export declare class RegistrationController {
    private readonly registrationService;
    constructor(registrationService: RegistrationService);
    signup(signupDto: any): Promise<{
        message: string;
        schoolId: string;
        adminMatricule: string;
        trialExpiresAt: Date;
    }>;
    activate(activateDto: {
        licenseKey: string;
    }): Promise<{
        name: string;
        id: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        licenseKey: string | null;
        logo: string | null;
        slogan: string | null;
        address: string | null;
        website: string | null;
        primaryColor: string | null;
        theme: string;
        defaultLanguage: string;
        licenseExpiresAt: Date | null;
        isActive: boolean;
    }>;
}
