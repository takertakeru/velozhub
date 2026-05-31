output "acm_certificate_arn" {
  description = "ARN of the ACM certificate"
  value = aws_acm_certificate.this.arn
}

output "validation_records" {
  description = "DNS records for certificate validation"
  value = aws_acm_certificate.this.domain_validation_options
}