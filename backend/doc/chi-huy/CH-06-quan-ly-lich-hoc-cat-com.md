# CH-06 - Quản lý lịch học & cắt cơm

## Thông tin chung
- **Nhóm ngườ dùng:** Chỉ huy
- **Mã chức năng:** CH-06
- **Tên chức năng:** Quản lý lịch học & cắt cơm

## Mô tả
Xem, điều chỉnh lịch học và lịch ăn của học viên; tự động ghi danh cắt cơm; xuất file Excel.

## Module liên quan
- Schedule Module
- Meal Schedule Module
- Export Module
- Cut Rice Module

## Luồng hoạt động chi tiết

### 1. Quản lý lịch học
1. Xem lịch học tập thể hoặc cá nhân.
2. Điều chỉnh ca học, phòng học.
3. Xuất Excel lịch học.

### 2. Thiết lập lịch cắt cơm
1. Thiết lập lịch cắt cơm theo đơn vị/ca (sáng, trưa, chiều, tối).
2. Định nghĩa khung giờ ăn mặc định.
3. Quy tắc tự động ghi danh: dựa trên thời khóa biểu, nếu học viên có ca học trùng khung giờ ăn thì tự động đăng ký cơm.

### 3. Tự động ghi danh cắt cơm
> ⚡ **Tự động**: Khi học viên cập nhật lịch học:
> 1. Hệ thống quét điều kiện thờ gian từ `time_tables.schedules`.
> 2. So sánh với khung giờ ăn tại đơn vị.
> 3. Tự động ghi danh vào danh sách cắt cơm ngày tương ứng trong `cut_rice.weekly`.
> 4. Đánh dấu `is_auto_generated = true`.
> 5. Gửi thông báo cho học viên: "Lịch cắt cơm tuần này đã được cập nhật tự động."

### 4. Xuất Excel
1. Xuất danh sách cắt cơm theo tuần/tháng.
2. Phân loại: theo đơn vị, theo ca.

## Giao diện & API
- `GET /api/commander/schedules` — Xem lịch học
- `PUT /api/commander/schedules/:id` — Điều chỉnh lịch học
- `GET /api/commander/cut-rice` — Xem lịch cắt cơm
- `POST /api/commander/cut-rice/generate` — Tạo lịch cắt cơm tự động
- `GET /api/commander/cut-rice/export` — Xuất Excel cắt cơm

## Dữ liệu & Database
- Bảng: `time_tables` (schedules JSONB), `cut_rice` (weekly JSONB)
- Cập nhật: `cut_rice.weekly`, `is_auto_generated`, `last_updated`

## Lưu ý bảo mật / Quyền hạn
- Chỉ chỉ huy đơn vị mới được điều chỉnh lịch học và cắt cơm.
- Lịch cắt cơm tự động có thể bị ghi đè nếu học viên tự đăng ký/hủy thủ công.
