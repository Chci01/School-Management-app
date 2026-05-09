"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAcademicYearDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_academic_year_dto_1 = require("./create-academic-year.dto");
class UpdateAcademicYearDto extends (0, mapped_types_1.PartialType)(create_academic_year_dto_1.CreateAcademicYearDto) {
}
exports.UpdateAcademicYearDto = UpdateAcademicYearDto;
//# sourceMappingURL=update-academic-year.dto.js.map