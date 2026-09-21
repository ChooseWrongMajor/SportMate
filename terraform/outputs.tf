output "vpc_id" {
  description = "SportMate VPC ID"
  value       = aws_vpc.sportmate.id
}

output "public_subnet_a_id" {
  description = "Public subnet A ID"
  value       = aws_subnet.public_a.id
}

output "public_subnet_b_id" {
  description = "Public subnet B ID"
  value       = aws_subnet.public_b.id
}

output "ec2_instance_id" {
  description = "Backend EC2 instance ID"
  value       = aws_instance.backend.id
}

output "ec2_public_ip" {
  description = "Backend EC2 public IPv4"
  value       = aws_instance.backend.public_ip
}

output "ec2_public_dns" {
  description = "Backend EC2 public DNS"
  value       = aws_instance.backend.public_dns
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = aws_lb.sportmate.dns_name
}

output "s3_bucket_name" {
  description = "Frontend S3 bucket"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain"
  value       = aws_cloudfront_distribution.frontend.domain_name
}