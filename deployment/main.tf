variable "docker_host" {
}

variable "tag" {
  default = "latest"
}

variable "environment" {}

variable "domain" {
  default = "party.maxjoehnk.me"
}

variable "web_network" {
  default = "web"
}

provider "docker" {
  host = var.docker_host
}

terraform {
  backend "http" {}
}

resource "docker_network" "internal" {
  name = "party-games-${var.environment}"
  check_duplicate = true
}
