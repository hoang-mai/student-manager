# HV-05 - Theo dõi trạng thái đề xuất

## Thông tin chung
- **Nhóm người dùng:** Học viên
- **Mã chức năng:** HV-05
- **Tên chức năng:** Theo dõi trạng thái đề xuất

## Mô tả
Xem phản hồi phê duyệt/từ chối và ghi chú từ chỉ huy.

## Module liên quan
- Grade Request Module
- Notification Module

## Luồng hoạt động chi tiết
1. Danh sách các đề xuất đã gửi kèm trạng thái.
2. Trạng thái: Chờ duyệt, Đã duyệt, Từ chối.
3. Xem ghi chú/phản hồi chi tiết từ chỉ huy khi có quyết định.

## Giao diện & API

| Thứ tự | Method | Endpoint | Auth | Mô tả |
|--------|--------|----------|------|-------|
| 1 | `GET` | `/api/students/grade-requests` | Token | Danh sách đề xuất của học viên |
| 2 | `GET` | `/api/students/grade-requests?status=PENDING` | Token | Lọc theo trạng thái |
| 3 | `GET` | `/api/students/grade-requests/:id` | Token | Xem chi tiết đề xuất (kèm ghi chú từ chỉ huy) |

### Luồng nghiệp vụ
```
1. GET /api/students/grade-requests           → Xem tất cả đề xuất
2. GET /api/students/grade-requests?status=PENDING → Lọc trạng thái chờ duyệt
3. GET /api/students/grade-requests/:id       → Xem chi tiết (reviewNote từ chỉ huy)
```

## Dữ liệu & Database
- Bảng: `grade_requests`
- Cột: `studentId`, `subjectResultId`, `requestType` (ADD/UPDATE/DELETE), `status` (PENDING/APPROVED/REJECTED), `reviewNote`, `reviewerId`, `reviewedAt`

## Lưu ý bảo mật / Quyền hạn
- *(Cập nhật theo phân quyền chi tiết)*
