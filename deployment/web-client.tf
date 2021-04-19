resource "docker_container" "web-client" {
  image = docker_image.web-client.latest
  name = "remote-party-games-web-client-${var.environment}"
  restart = "always"

  labels {
    label = "traefik.enable"
    value = "true"
  }

  labels {
    label = "traefik.http.routers.party-games-${var.environment}-web-client.rule"
    value = "Host(`${var.domain}`)"
  }

  networks_advanced {
    name = var.web_network
  }
}

resource "docker_image" "web-client" {
  name = data.docker_registry_image.web-client.name
  pull_triggers = [data.docker_registry_image.web-client.sha256_digest]
  keep_locally = true
}

data "docker_registry_image" "web-client" {
  name = "registry.gitlab.com/maxjoehnk/remote-party-games/web-client:${var.tag}"
}
