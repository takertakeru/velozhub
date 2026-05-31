variable "project_name" {
  description = "Project name for tagging"
  type        = string
}

variable "s3_bucket_domain_name" {
  description = "S3 bucket domain name (from S3 module output)"
  type        = string
}

variable "domain_name" {
  description = "Custom domain (optional)"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for HTTPS (optional)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to CloudFront distribution"
  type        = map(string)
  default     = {}
}