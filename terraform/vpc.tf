//VPC
resource "aws_vpc" "sportmate" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

//Internet Gateway
resource "aws_internet_gateway" "sportmate" {
  vpc_id = aws_vpc.sportmate.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

//Public subnet A
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.sportmate.id
  cidr_block              = var.public_subnet_a_cidr
  availability_zone       = var.availability_zone_a
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-a"
    Tier = "public"
  }
}

//Public subnet B
resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.sportmate.id
  cidr_block              = var.public_subnet_b_cidr
  availability_zone       = var.availability_zone_b
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-b"
    Tier = "public"
  }
}

//Private subnet A
resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.sportmate.id
  cidr_block        = var.private_subnet_a_cidr
  availability_zone = var.availability_zone_a

  tags = {
    Name = "${var.project_name}-private-a"
    Tier = "private"
  }
}

//Private subnet B
resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.sportmate.id
  cidr_block        = var.private_subnet_b_cidr
  availability_zone = var.availability_zone_b

  tags = {
    Name = "${var.project_name}-private-b"
    Tier = "private"
  }
}

//Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.sportmate.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.sportmate.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

//Associate Public A
resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

//Associate Public B
resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

//Private Route Table
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.sportmate.id

  tags = {
    Name = "${var.project_name}-private-rt"
  }
}

//Associate Private A
resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private.id
}

//Associate Private B
resource "aws_route_table_association" "private_b" {
  subnet_id      = aws_subnet.private_b.id
  route_table_id = aws_route_table.private.id
}
