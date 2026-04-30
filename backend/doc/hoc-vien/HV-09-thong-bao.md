# HV-09 - Thông báo

## Thông tin chung
- **Nhóm ngườ dùng:** Học viên
- **Mã chức năng:** HV-09
- **Tên chức năng:** Nhận thông báo

## Mô tả
Học viên nhận thông báo tự động từ hệ thống khi có sự kiện quan trọng: điểm được cập nhật, đề xuất được phê duyệt/từ chối, lịch cắt cơm thay đổi...

## Module liên quan
- Notification Module
- Student Module

## Luồng hoạt động chi tiết

### 1. Nhận thông báo tự động
Hệ thống tự động gửi thông báo khi:
1. Điểm được cập nhật sau phê duyệt (CH-04).
2. Đề xuất cập nhật điểm được phê duyệt hoặc từ chối (HV-05).
3. Lịch cắt cơm được tạo/cập nhật tự động (HV-07).
4. Có khen thưởng mới được ghi nhận (CH-05).
5. Có thông báo chung từ chỉ huy/đơn vị.

### 2. Xem danh sách thông báo
1. Danh sách thông báo sắp xếp theo thờ gian, mới nhất lên đầu.
2. Phân loại: chưa đọc / đã đọc.
3. Lọc theo loại: điểm, đề xuất, cắt cơm, khen thưởng, chung.

### 3. Đánh dấu đã đọc
1. Click vào thông báo để xem chi tiết.
2. Tự động đánh dấu `is_read = true`.
3. Có thể đánh dấu đọc tất cả một lúc.

## Giao diện & API
- `GET /api/student/notifications` — Danh sách thông báo
- `GET /api/student/notifications/:id` — Chi tiết thông báo
- `PUT /api/student/notifications/:id/read` — Đánh dấu đã đọc
- `PUT /api/student/notifications/read-all` — Đánh dấu đọc tất cả

## Dữ liệu & Database
- Bảng: `notifications`
- Cột: `title`, `content`, `type`, `link`, `is_read`, `student_id`

## Lưu ý bảo mật / Quyền hạn
- Học viên chỉ xem thông báo của chính mình.
- Thông báo không thể chỉnh sửa hoặc xóa bởi học viên.
