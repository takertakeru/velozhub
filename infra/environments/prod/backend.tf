# Terraform backend configuration
terraform {
  backend "s3" {
    key          = "aboitiz_streetlight_frontend/prod/terraform.tfstate"
    bucket       = "terraform-bkct-state"
    region       = "ap-southeast-1"
    encrypt      = true
    use_lockfile = true
  }
}
