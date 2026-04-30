# HV-07 - Xem lịch cắt cơm tự động

## Thông tin chung
- **Nhóm ngườ dùng:** Học viên
- **Mã chức năng:** HV-07
- **Tên chức năng:** Xem lịch cắt cơm tự động

## Mô tả
Hệ thống tự động hiển thị lịch cắt cơm dựa trên lịch học cá nhân. Học viên cũng có thể điều chỉnh thủ công nếu cần.

## Module liên quan
- Meal Schedule Module
- Schedule Module
- Cut Rice Module

## Luồng hoạt động chi tiết

### 1. Tự động tạo lịch cắt cơm
1. Dựa vào thờ khóa biểu (`time_tables.schedules`) để xác định ca cắt cơm.
2. Hiển thị theo tuần: sáng, trưa, chiều, tối.
3. Cập nhật tự động khi lịch học thay đổi.

### 2. Tự động ghi danh cắt cơm
> ⚡ **Tự động**: Khi học viên cập nhật lịch học (HV-06):
> 1. Hệ thống quét điều kiện thờ gian từ `time_tables.schedules`.
> 2. So sánh với khung giờ ăn tại đơn vị.
> 3. Tự động ghi danh vào danh sách cắt cơm ngày tương ứng trong `cut_rice.weekly`.
> 4. Đánh dấu `is_auto_generated = true`.

### 3. Điều chỉnh thủ công
1. Học viên có thể đăng ký thêm hoặc hủy một bữa ăn cụ thể.
2. Sau khi điều chỉnh thủ công, `is_auto_generated` chuyển thành `false`.
3. Ghi chú lý do điều chỉnh vào `notes`.

## Giao diện & API
- `GET /api/student/cut-rice` — Xem lịch cắt cơm tuần hiện tại
- `PUT /api/student/cut-rice` — Điều chỉnh lịch cắt cơm thủ công

## Dữ liệu & Database
- Bảng: `cut_rice`
- Cột: `weekly` (JSONB), `is_auto_generated`, `last_updated`, `notes`

## Lưu ý bảo mật / Quyền hạn
- Học viên chỉ xem/chỉnh lịch cắt cơm của chính mình.
- Việc hủy cơm cần có lý do để đơn vị hậu cần theo dõi.
