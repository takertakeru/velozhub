# Spin up an S3 bucket with the specified name and environment.
# force_destroy allows Terraform to delete the bucket even if it contains objects.
resource "aws_s3_bucket" "this" {
  bucket = "${var.bucket_name}-${var.env}"

  force_destroy = var.force_destroy

  tags = merge(var.tags, {
    Name        = "${var.bucket_name}-${var.env}"
    Owner       = var.owner
    Environment = var.env
  })
}

# if they are ever overwritten. This helps maintain an immutable audit trail.
resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id

  versioning_configuration {
    status = "Enabled"
  }  
}

# Block public access to the bucket.
resource "aws_s3_bucket_public_access_block" "this" {
  bucket                  = aws_s3_bucket.this.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Data source for policy (allow CloudFront or specific principal)
data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    sid = "AllowCloudFrontAccess"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = ["${aws_s3_bucket.this.arn}/*"]

    # Cloudfront Origin Access Control
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [var.cloudfront_distribution_arn]
    }
  }
}

# Website hosting configuration
resource "aws_s3_bucket_website_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# Attach the policy above to the S3 bucket
resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}