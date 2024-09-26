# Hướng dẫn Triển khai

Dưới đây là trình tự thực hiện để triển khai các thành phần của dự án.

Ở trong thư mục infra/K8S thực hiện tuần tự các bước sau: 

## 1. Triển khai Local Persistent Volume Claim (PVC)

- Triển khai Local Persistent Volume Claim bằng cách sử dụng `local-pvc.yml`:

  ```zsh
  kubectl apply -f local-pvc.yml
  ```

## 2. Triển khai MongoDB và PostgreSQL

- Triển khai MongoDB bằng cách sử dụng `mongo-depl.yml`:

    ```zsh
    kubectl apply -f mongo-depl.yml
    ```

- Triển khai PostgreSQL bằng cách sử dụng `postgres-depl.yml`:

    ```zsh
    kubectl apply -f postgres-depl.yml
    ```

## 2. Triển khai RabbitMQ

Triển khai RabbitMQ bằng cách sử dụng `rabbit-depl.yml`:

```zsh
kubectl apply -f rabbit-depl.yml
```

## 3. Triển khai các Microservices

Triển khai các microservices, bao gồm Auction, Bid, Notify, Search, và WebApp, bằng cách sử dụng các tệp YAML tương ứng:

```zsh
kubectl apply -f auction-depl.yml
kubectl apply -f bid-depl.yml
kubectl apply -f notifiy-depl.yml
kubectl apply -f search-depl.yml
kubectl apply -f webapp-depl.yml
```

## 4. Triển khai Gateway và Ingress

Triển khai Gateway bằng cách sử dụng `gateway-depl.yml`:

```zsh
kubectl apply -f gateway-depl.yml
```

Triển khai Ingress và Load Balancer bằng cách sử dụng `ingress-svc.yml` và `deploy.yaml`:

```zsh
kubectl apply -f deploy.yaml
```

```zsh
kubectl apply -f ingress-svc.yml
```

## Lưu Ý
- Đảm bảo rằng Cluster Kubernetes Docker Desktop đang chạy trước khi thực hiện các bước cài đặt.

## Tác Giả
[Duy Nguyen Bui](https://github.com/duynguyenbui)