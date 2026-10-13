output "ec2_instance_id" {
  description = "SportMate EC2 instance ID"
  value       = aws_instance.app.id
}
output "ec2_public_ip" {
  description = "Public IPv4; can change after stop/start"
  value       = aws_instance.app.public_ip
}
output "ec2_public_dns" {
  description = "EC2 public DNS"
  value       = aws_instance.app.public_dns
}
output "ssh_command" {
  description = "SSH template; replace KEY_PATH with the private key path"
  value       = "ssh -i KEY_PATH ubuntu@${aws_instance.app.public_ip}"
}
output "vpc_id" {
  description = "SportMate VPC ID"
  value       = aws_vpc.sportmate.id
}
