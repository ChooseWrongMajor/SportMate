variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}
variable "project_name" {
  description = "Project name"
  type        = string
  default     = "sportmate"
}
variable "environment" {
  description = "Environment tag"
  type        = string
  default     = "dev"
}
variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "10.20.0.0/16"
}
variable "public_subnet_cidr" {
  description = "Public subnet CIDR"
  type        = string
  default     = "10.20.1.0/24"
}
variable "availability_zone" {
  description = "Subnet Availability Zone"
  type        = string
  default     = "ap-southeast-1a"
}
variable "instance_type" {
  description = "EC2 type; check account eligibility and pricing"
  type        = string
  default     = "t3.micro"
}
variable "key_name" {
  description = "Existing EC2 Key Pair name in selected region"
  type        = string
}
variable "my_ip" {
  description = "Administrator public IPv4 in CIDR notation, e.g. 1.2.3.4/32"
  type        = string
}
variable "root_volume_size" {
  description = "EC2 root EBS volume size in GiB"
  type        = number
  default     = 20
}
