"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConductDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_conduct_dto_1 = require("./create-conduct.dto");
class UpdateConductDto extends (0, mapped_types_1.PartialType)(create_conduct_dto_1.CreateConductDto) {
}
exports.UpdateConductDto = UpdateConductDto;
//# sourceMappingURL=update-conduct.dto.js.map