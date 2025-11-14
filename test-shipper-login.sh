#!/bin/bash

# Script test đăng nhập shipper
# Email đúng: shipper@shopcuathuy.com (có "er")
# Email sai: ship@shopcuathuy.com (thiếu "er")

echo "Testing Shipper Login..."
echo "Email: shipper@shopcuathuy.com"
echo "Password: 123456"
echo ""

curl 'http://localhost:3000/api/auth/login' \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"shipper@shopcuathuy.com","password":"123456"}' \
  -v

echo ""
echo ""
echo "Nếu bị lỗi 401, có thể:"
echo "1. Tài khoản chưa tồn tại trong database - cần chạy script create-shipper-account.sql"
echo "2. Backend chưa chạy - kiểm tra http://localhost:8080"
echo "3. Email hoặc mật khẩu sai - email phải là shipper@shopcuathuy.com (có 'er')"


