# HV-06 - Quản lý lịch học

## Thông tin chung
- **Nhóm người dùng:** Học viên
- **Mã chức năng:** HV-06
- **Tên chức năng:** Quản lý lịch học

## Mô tả
Xem, thêm, chỉnh sửa và xóa các môn học trong lịch học cá nhân. Hệ thống tự động tạo và cập nhật lịch cắt cơm dựa trên lịch học.

## Module liên quan
- Schedule Module
- Course Module
- Meal Schedule Module

## Luồng hoạt động chi tiết

### 1. Xem lịch học
1. Hiển thị lịch học theo tuần, dạng lưới hoặc danh sách.
2. Bao gồm các môn học với thời gian, địa điểm và các thông tin liên quan.

### 2. Thêm lịch học
1. Học viên thêm môn học vào lịch với các thông tin:
   - Ngày học
   - Giờ bắt đầu
   - Giờ kết thúc
   - Tên môn học
   - Địa điểm
2. Hệ thống tự động tạo lịch cắt cơm dựa trên lịch học và giờ ăn cố định (sáng 06:00, trưa 11:00, tối 17:30).

### 3. Cập nhật lịch học
1. Học viên có thể chỉnh sửa hoặc xóa các môn học trong lịch học.
2. Khi có thay đổi, hệ thống tự động cập nhật lại lịch cắt cơm tương ứng.

## Giao diện & API

| Thứ tự | Method | Endpoint | Auth | Mô tả |
|--------|--------|----------|------|-------|
| 1 | `GET` | `/api/students/time-table` | Token | Xem lịch học |
| 2 | `POST` | `/api/students/time-table` | Token | Thêm môn học vào lịch |
| 3 | `PUT` | `/api/students/time-table/:id` | Token | Cập nhật môn học |
| 4 | `DELETE` | `/api/students/time-table/:id` | Token | Xóa môn học khỏi lịch |

### Luồng nghiệp vụ
```
1. GET  /api/students/time-table        → Xem danh sách lịch học hiện tại
2. POST /api/students/time-table        → Thêm môn học mới (tự động tạo lịch cắt cơm)
   Body: { schedules: [{ day, startTime, endTime, room, subjectName }] }
3. PUT  /api/students/time-table/:id    → Sửa môn học (tự động cập nhật lịch cắt cơm)
4. DEL  /api/students/time-table/:id    → Xóa môn học
```

## Dữ liệu & Database
- Bảng: `time_tables`
- Cột: `studentId`, `schedules` (JSONB: [{day, startTime, endTime, room}])

## Lưu ý bảo mật / Quyền hạn
- Học viên chỉ được quản lý lịch học của chính mình.
- Hệ thống tự động đồng bộ lịch cắt cơm khi có thay đổi lịch học.
