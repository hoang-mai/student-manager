# CH-04 - Phê duyệt đề xuất

## Thông tin chung
- **Nhóm ngườ dùng:** Chỉ huy
- **Mã chức năng:** CH-04
- **Tên chức năng:** Phê duyệt đề xuất

## Mô tả
Tiếp nhận và xử lý các đề xuất thay đổi điểm số hoặc thông tin từ học viên gửi lên.

## Module liên quan
- Grade Request Module
- Notification Module
- Grade Module
- Academic Result Module

## Luồng hoạt động chi tiết

### 1. Xem danh sách đề xuất chờ duyệt
1. Danh sách đề xuất chờ duyệt hiển thị theo thờ gian gửi.
2. Lọc theo: loại đề xuất (thêm/sửa/xóa), học viên, môn học, trạng thái.

### 2. Xem chi tiết yêu cầu
1. Xem thông tin học viên, môn học, điểm đề xuất.
2. Xem file minh chứng đính kèm (ảnh, PDF).
3. So sánh điểm hiện tại và điểm đề xuất.

### 3. Phê duyệt / Từ chối
1. Chỉ huy chọn "Chấp nhận" hoặc "Từ chối".
2. Nếu từ chối: nhập lý do, gửi phản hồi về học viên.
3. Nếu chấp nhận: điểm tự động cập nhật vào hệ thống.

### 4. Tự động tính toán lại CPA
> ⚡ **Tự động**: Sau khi phê duyệt, hệ thống tự động:
> 1. Cập nhật điểm vào bảng `subject_results`.
> 2. Tính lại GPA cho `semester_results` liên quan.
> 3. Tính lại CPA cho `yearly_results` liên quan.
> 4. Cập nhật `current_cpa4` và `current_cpa10` trong bảng `students`.
> 5. Gửi thông báo cho học viên: "Điểm của bạn đã được cập nhật. CPA mới: X.XX".

## Giao diện & API
- `GET /api/commander/grade-requests` — Danh sách đề xuất
- `GET /api/commander/grade-requests/:id` — Chi tiết đề xuất
- `POST /api/commander/grade-requests/:id/approve` — Phê duyệt
- `POST /api/commander/grade-requests/:id/reject` — Từ chối

## Dữ liệu & Database
- Bảng: `yearly_results`, `semester_results`, `subject_results`
- Cập nhật: `score_10`, `score_4`, `letter_grade` trong `subject_results`
- Tính toán lại: `average_grade4/10`, `cumulative_grade4/10`, `current_cpa4/10`

## Lưu ý bảo mật / Quyền hạn
- Chỉ chỉ huy được phân công hoặc có quyền mới được duyệt.
- Lịch sử phê duyệt được ghi log đầy đủ.
- CPA tự động tính lại là bất biến (atomic transaction).
