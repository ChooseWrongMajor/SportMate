resource "aws_instance" "backend" {
  ami           = var.ami_id
  instance_type = var.instance_type

  subnet_id = aws_subnet.public_a.id

  key_name = var.key_name

  vpc_security_group_ids = [
    aws_security_group.ec2.id
  ]

  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  user_data = <<-EOF
    #!/bin/bash

    set -e

    apt-get update -y

    apt-get install -y \
      docker.io \
      git \
      curl

    systemctl enable docker
    systemctl start docker

    usermod -aG docker ubuntu
  EOF

  tags = {
    Name = "${var.project_name}-backend"
  }
}