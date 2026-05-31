# --- S3 Module ---
module "s3_bucket" {
  source = "../../modules/s3"

  bucket_name                 = var.bucket_name
  env                         = var.env
  force_destroy               = true
  cloudfront_distribution_arn = module.cloudfront.distribution_arn

  tags = {
    Owner       = var.owner
    Environment = var.env
    CostCenter  = var.env
  }
}

# --- CloudFront Module ---
module "cloudfront" {
  source = "../../modules/cloudfront"

  project_name          = var.project_name
  domain_name           = var.domain_name
  acm_certificate_arn   = module.acm.acm_certificate_arn
  s3_bucket_domain_name = module.s3_bucket.bucket_regional_domain_name
  tags = {
    Environment = var.env
    Project     = var.project_name
  }
}

# --- AWS Certificate Manager ---
module "acm" {
  source = "../../modules/acm"

  domain_name               = var.domain_name
  subject_alternative_names = var.subject_alternative_names

  tags = {
    Owner       = var.owner
    Environment = var.env
    CostCenter  = var.env
  }
}
