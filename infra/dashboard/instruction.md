# Kubernetes Dashboard Web UI Setup

## Giới Thiệu
Hướng dẫn cách cài đặt Kubernetes Dashboard và một số thành phần liên quan trên môi trường Kubernetes sử dụng Docker Desktop Kubernetes.

## Yêu Cầu
- Docker Desktop đã được cài đặt và Kubernetes Cluster đã được bật.
- Trong thư mục infra/dashboard
## Cài Đặt

### Bước 1: Chạy Kubernetes Dashboard
```zsh
kubectl apply -f dashboard-v2.7.0.yaml 
```

### Bước 2: Tạo Người Dùng Mẫu
```zsh
kubectl apply -f admin-user.yaml 
```

### Bước 3: Lấy Token Người Dùng
```zsh
kubectl -n kubernetes-dashboard create token admin-user
```

### Bước 4: Chạy Metric Server
```zsh
kubectl apply -f components.yaml
```

### Bước 5: Proxy Kubernetes API
```zsh
kubectl proxy
```

### Bước 6: Truy Cập Dashboard
Mở trình duyệt và truy cập vào địa chỉ sau:
```
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

## Lưu Ý
- Đảm bảo rằng Cluster Kubernetes Docker Desktop đang chạy trước khi thực hiện các bước cài đặt.

## Tác Giả
[Duy Nguyen Bui](https://github.com/duynguyenbui)