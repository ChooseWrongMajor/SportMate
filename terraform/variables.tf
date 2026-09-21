variable "aws_region" {
  description = "AWS Region"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

# -------------------------
# VPC
# -------------------------

variable "vpc_cidr" {
  description = "CIDR block of the VPC"
  type        = string
}

# -------------------------
# Availability Zones
# -------------------------

variable "availability_zone_a" {
  description = "First Availability Zone"
  type        = string
}

variable "availability_zone_b" {
  description = "Second Availability Zone"
  type        = string
}

# -------------------------
# Public Subnets
# -------------------------

variable "public_subnet_a_cidr" {
  description = "CIDR block for public subnet A"
  type        = string
}

variable "public_subnet_b_cidr" {
  description = "CIDR block for public subnet B"
  type        = string
}

# -------------------------
# Private Subnets
# -------------------------

variable "private_subnet_a_cidr" {
  description = "CIDR block for private subnet A"
  type        = string
}

variable "private_subnet_b_cidr" {
  description = "CIDR block for private subnet B"
  type        = string
}

# -------------------------
# EC2
# -------------------------

variable "ami_id" {
  description = "Ubuntu AMI ID"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "key_name" {
  description = "Existing EC2 Key Pair name"
  type        = string
}

variable "my_ip" {
  description = "Your public IP address in CIDR notation, e.g. 1.2.3.4/32"
  type        = string
}

# -------------------------
# S3
# -------------------------

variable "frontend_bucket_name" {
  description = "Globally unique S3 bucket name for SportMate frontend"
  type        = string
}