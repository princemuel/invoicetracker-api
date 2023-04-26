# Notes

```sh
`ACCESS_TOKEN`
openssl genrsa -out private-at.pem 2048
openssl rsa -in private-at.pem -pubout -outform PEM -out public-at.pem

`REFRESH_TOKEN`
openssl genrsa -out private-rt.pem 2048
openssl rsa -in private-rt.pem -pubout -outform PEM -out public-rt.pem


echo "JWT_PRIVATE_KEY=\"`sed -E 's/$/\\\n/g' private.pem`\"" >> .env
echo "JWT_PUBLIC_KEY=\"`sed -E 's/$/\\\n/g' public.pem`\"" >> .env

```
