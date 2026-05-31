output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront.domain_name
}

output "cloudfront_distribution_id" {
  description = "Cloudfront distribution Id"
  value = module.cloudfront.distribution_id
}

output "s3_bucket_name" {
  description = "Deployed S3 bucket name"
  value       = module.s3_bucket.bucket_name
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN"
  value       = module.acm.acm_certificate_arn
}

output "acm_validation_records" {
  description = "ACM DNS validation records (add these to Cloudflare)"
  value       = module.acm.validation_records
}