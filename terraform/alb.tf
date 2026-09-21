//Application Load Balancer
resource "aws_lb" "sportmate" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]

  tags = {
    Name = "${var.project_name}-alb"
  }
}

//ALB Target Group
resource "aws_lb_target_group" "backend" {
  name        = "${var.project_name}-backend-tg"
  port        = 5000
  protocol    = "HTTP"
  target_type = "instance"

  vpc_id = aws_vpc.sportmate.id

  health_check {
    enabled             = true
    protocol            = "HTTP"
    port                = "5000"
    path                = "/api/health"

    healthy_threshold   = 2
    unhealthy_threshold = 3

    timeout  = 5
    interval = 30

    matcher = "200"
  }

  tags = {
    Name = "${var.project_name}-backend-tg"
  }
}

//Đưa EC2 vào Target Group
resource "aws_lb_target_group_attachment" "backend" {
  target_group_arn = aws_lb_target_group.backend.arn

  target_id = aws_instance.backend.id

  port = 5000
}

//ALB Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.sportmate.arn

  port     = 80
  protocol = "HTTP"

  default_action {
    type = "forward"

    target_group_arn = aws_lb_target_group.backend.arn
  }
}