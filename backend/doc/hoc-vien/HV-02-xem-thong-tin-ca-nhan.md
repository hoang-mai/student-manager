# HV-02 - Quản lý thông tin cá nhân

## Thông tin chung
- **Nhóm ngườ dùng:** Học viên
- **Mã chức năng:** HV-02
- **Tên chức năng:** Quản lý thông tin cá nhân

## Mô tả
Học viên có thể xem và tự cập nhật các thông tin cá nhân, thông tin quân nhân (cấp bậc, chức vụ) của mình.

## Module liên quan
- User Module
- Profile Module
- Student Record Module

## Luồng hoạt động chi tiết

### 1. Xem thông tin cá nhân
1. Hiển thị thông tin cá nhân: họ tên, ngày sinh, đơn vị, cấp bậc.
2. Tích hợp thông tin quân nhân từ hệ thống HR nội bộ.
3. Thông tin học tập: trường, chuyên ngành, lớp, niên khóa.

### 2. Cập nhật thông tin cá nhân
1. Học viên vào trang chỉnh sửa hồ sơ.
2. Các trường có thể tự cập nhật: `current_address`, `phone_number`, `email`, `avatar`.
3. Các trường thông tin quân nhân (nếu có quyền): `rank`, `unit`, `position_government`, `position_party`.
4. Upload ảnh đại diện mới.
5. Hệ thống kiểm tra định dạng và validate dữ liệu.
6. Lưu thay đổi, cập nhật `updated_at`.

## Giao diện & API
- `GET /api/student/profile` — Lấy thông tin cá nhân
- `PUT /api/student/profile` — Cập nhật thông tin cá nhân
- `POST /api/student/avatar` — Upload ảnh đại diện

## Dữ liệu & Database
- Bảng: `students`
- Cột cập nhật: `full_name`, `current_address`, `phone_number`, `email`, `avatar`, `rank`, `unit`, `position_government`, `position_party`

## Lưu ý bảo mật / Quyền hạn
- Học viên chỉ được cập nhật thông tin của chính mình (`student_id` trong JWT token).
- Một số trường nhạy cảm (CCCD, ngày sinh) có thể bị khóa chỉnh sửa tùy theo cấu hình hệ thống.
