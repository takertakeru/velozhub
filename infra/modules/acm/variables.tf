variable "domain_name" {
  type        = string
  description = "Domain or subdomain for SSL certificate"
}

variable "subject_alternative_names" {
  type        = list(string)
  default     = []
  description = "Additional domains for the certificate"
}

variable "tags" {
  description = "AWS Certificate Manager tags"
  type    = map(string)
  default = {}
}
