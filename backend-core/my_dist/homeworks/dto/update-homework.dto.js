"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHomeworkDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_homework_dto_1 = require("./create-homework.dto");
class UpdateHomeworkDto extends (0, mapped_types_1.PartialType)(create_homework_dto_1.CreateHomeworkDto) {
}
exports.UpdateHomeworkDto = UpdateHomeworkDto;
//# sourceMappingURL=update-homework.dto.js.map