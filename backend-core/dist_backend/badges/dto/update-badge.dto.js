"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBadgeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_badge_dto_1 = require("./create-badge.dto");
class UpdateBadgeDto extends (0, mapped_types_1.PartialType)(create_badge_dto_1.CreateBadgeDto) {
}
exports.UpdateBadgeDto = UpdateBadgeDto;
//# sourceMappingURL=update-badge.dto.js.map