"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = exports.Role = void 0;
const common_1 = require("@nestjs/common");
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN_ECOLE"] = "ADMIN_ECOLE";
    Role["ENSEIGNANT"] = "ENSEIGNANT";
    Role["ELEVE"] = "ELEVE";
    Role["PARENT"] = "PARENT";
})(Role || (exports.Role = Role = {}));
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map