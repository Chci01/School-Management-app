export declare class AttendanceRecordDto {
    studentId: string;
    status: string;
    reason?: string;
}
export declare class CreateAttendanceDto {
    schoolId: string;
    classId: string;
    date: string;
    records: AttendanceRecordDto[];
}
