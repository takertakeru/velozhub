# modules/cloudfront/main.tf
resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "${var.project_name}-OAC"
  description                       = "OAC for CloudFront to access S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  comment             = "${var.project_name} frontend distribution"
  default_root_object = "index.html"

  origin {
    domain_name = var.s3_bucket_domain_name
    origin_id   = "s3-origin"

    s3_origin_config {
      origin_access_identity = ""
    }

    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    compress         = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Optional: custom domain, to be wired up with Route53 later
  # Currently using cloudflare subdomain that was certified using AWS Certificate Manager
  aliases = [
    var.domain_name,          # 
    "www.${var.domain_name}", #
  ]

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Custom Error Response
  custom_error_response {
    error_code = 403
    response_code = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code = 400
    response_code = 200
    response_page_path = "/index.hmtl"
  }

  # Avoid Downtime
  wait_for_deployment = true

  price_class = "PriceClass_100" # Cheapest (use PriceClass_All for global)
  tags        = var.tags
}
