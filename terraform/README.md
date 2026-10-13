# SportMate AWS Terraform - minimal deployment

This Terraform configuration creates one Ubuntu EC2 instance, a custom VPC, one public subnet, an Internet Gateway, route table, and a security group. The EC2 bootstrap installs Docker, Docker Compose v2, Nginx, and Certbot.

## Architecture choice
- No ALB, NAT Gateway, RDS, EKS, S3, or CloudFront in this first minimal version.
- Frontend, backend, and PostgreSQL can run on the same EC2 using Docker Compose and Nginx.
- Do not expose PostgreSQL port 5432 to the Internet.
- SSH port 22 is restricted to `my_ip`; HTTP/HTTPS are public.
- EC2 public IP can change after stop/start. An Elastic IP may make it stable but can incur charges; check AWS pricing first.
- This is a learning/development setup, not highly available production.
- AWS charges may still apply. Check account plan, credits, and Billing before apply.

## Before apply
1. Verify credentials: `aws sts get-caller-identity`
2. Ensure the EC2 key pair exists in `ap-southeast-1`.
3. Set `my_ip` to your current public IPv4 with `/32`.
4. Copy `terraform.tfvars.example` to `terraform.tfvars` and edit it.
5. Keep `terraform.tfvars`, private keys, `.env`, and state files out of public Git repositories.

## Commands (PowerShell)
```powershell
terraform init
terraform fmt -recursive
terraform validate
terraform plan
```
Review the full plan and estimated costs before:
```powershell
terraform apply
```
Then:
```powershell
terraform output
```

SSH example:
```powershell
ssh -i "C:\path\to\SportMateEC2KeyPair.pem" ubuntu@PUBLIC_IP
```

## Next steps
1. Upload and restore the PostgreSQL backup securely.
2. Deploy backend and PostgreSQL using Docker Compose.
3. Configure Nginx reverse proxy for frontend and `/api`.
4. Point `sportmate.id.vn` DNS A record at the EC2 public IP in PA Vietnam.
5. After DNS resolves, use Certbot to enable HTTPS.
6. Build frontend with `VITE_API_URL=https://sportmate.id.vn/api` if serving API through the same domain.
7. Test login, matches, participants, messages, and notifications before treating migration as complete.

S3 + CloudFront can be added later. This first version intentionally reduces moving parts and recurring service costs.
