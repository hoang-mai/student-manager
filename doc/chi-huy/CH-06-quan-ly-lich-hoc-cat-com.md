# CH-06 - Quản lý lịch học & cắt cơm

## Thông tin chung
- **Nhóm người dùng:** Chỉ huy
- **Mã chức năng:** CH-06
- **Tên chức năng:** Quản lý lịch học & cắt cơm

## Mô tả
Xem lịch học của học viên; quản lý lịch cắt cơm (xem, cập nhật, tạo tự động, reset, cập nhật thủ công); xuất báo cáo lịch học và lịch cắt cơm dưới dạng Excel.

## Module liên quan
- Schedule Module
- Meal Schedule Module
- Export Module
- Cut Rice Module

## Luồng hoạt động chi tiết

### 1. Xem lịch học của học viên
1. Xem lịch học của bất kỳ học viên nào trong hệ thống.
2. Hiển thị theo tuần, bao gồm các môn học, thời gian, địa điểm.

### 2. Quản lý lịch cắt cơm
1. Xem lịch cắt cơm của học viên.
2. Tạo lịch cắt cơm tự động cho tất cả học viên hoặc cho từng học viên cụ thể.
3. Reset về lịch tự động.
4. Cập nhật lịch cắt cơm thủ công khi cần.

### 3. Tự động tạo lịch cắt cơm
Hệ thống tự động tính toán lịch cắt cơm dựa trên lịch học, thời gian đi lại từ đơn vị và các giờ ăn cố định:
- Sáng: 06:00
- Trưa: 11:00
- Tối: 17:30

Khi học viên cập nhật lịch học:
1. Hệ thống quét điều kiện thời gian từ `time_tables.schedules`.
2. So sánh với giờ ăn cố định và thời gian đi lại.
3. Tự động ghi danh vào danh sách cắt cơm ngày tương ứng trong `cut_rice.weekly`.
4. Đánh dấu `is_auto_generated = true`.

### 4. Xuất báo cáo
1. Xuất báo cáo lịch học kèm lịch cắt cơm dưới dạng file Excel.
2. Phân loại: theo đơn vị, theo ca.

## Giao diện & API
- `GET /api/commander/schedules` — Xem lịch học
- `GET /api/commander/cut-rice` — Xem lịch cắt cơm
- `POST /api/commander/cut-rice/generate` — Tạo lịch cắt cơm tự động (tất cả hoặc từng học viên)
- `POST /api/commander/cut-rice/reset` — Reset về lịch tự động
- `PUT /api/commander/cut-rice/:id` — Cập nhật lịch cắt cơm thủ công
- `GET /api/commander/cut-rice/export` — Xuất Excel lịch học kèm cắt cơm

## Dữ liệu & Database
- Bảng: `time_tables` (schedules JSONB), `cut_rice` (weekly JSONB)
- Cập nhật: `cut_rice.weekly`, `is_auto_generated`, `last_updated`

## Lưu ý bảo mật / Quyền hạn
- Chỉ chỉ huy mới được quản lý lịch học và lịch cắt cơm.
- Reset lịch cắt cơm sẽ xóa các điều chỉnh thủ công và tạo lại theo lịch tự động.
