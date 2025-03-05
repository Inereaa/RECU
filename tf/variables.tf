
variable "region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "Rango CIDR de la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Rango CIDR de la subred pública"
  type        = string
  default     = "10.0.1.0/24"
}

variable "http_port" {
  description = "Puerto HTTP principal"
  default     = 80
}

variable "https_port" {
  description = "Puerto HTTPS"
  default     = 443
}

