export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN_ECOLE = "ADMIN_ECOLE",
    ENSEIGNANT = "ENSEIGNANT",
    ELEVE = "ELEVE",
    PARENT = "PARENT"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
