"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSupplyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_supply_dto_1 = require("./create-supply.dto");
class UpdateSupplyDto extends (0, mapped_types_1.PartialType)(create_supply_dto_1.CreateSupplyDto) {
}
exports.UpdateSupplyDto = UpdateSupplyDto;
//# sourceMappingURL=update-supply.dto.js.map