"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHealthDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_health_dto_1 = require("./create-health.dto");
class UpdateHealthDto extends (0, mapped_types_1.PartialType)(create_health_dto_1.CreateHealthDto) {
}
exports.UpdateHealthDto = UpdateHealthDto;
//# sourceMappingURL=update-health.dto.js.map