resource "docker_container" "image" {
  image = docker_image.image.latest
  name = "remote-party-games-image-${var.environment}"
  restart = "always"

  labels {
    label = "traefik.enable"
    value = "true"
  }

  labels {
    label = "traefik.http.routers.party-games-${var.environment}-image.rule"
    value = "Host(`${var.domain}`) && PathPrefix(`/api/image`)"
  }

  labels {
    label = "traefik.docker.network"
    value = var.web_network
  }

  networks_advanced {
    name = var.web_network
  }

  networks_advanced {
    name = docker_network.internal.name
    aliases = ["image"]
  }

  env = [
    "MATCHMAKING_URL=http://matchmaking:8090"
  ]

  volumes {
    container_path = "/etc/party-games/storage"
    volume_name = docker_volume.image_data.name
  }
}

resource "docker_image" "image" {
  name = data.docker_registry_image.image.name
  pull_triggers = [data.docker_registry_image.image.sha256_digest]
}

data "docker_registry_image" "image" {
  name = "registry.gitlab.com/maxjoehnk/remote-party-games/image:${var.tag}"
}

resource "docker_volume" "image_data" {
  name = "party-games-images-${var.environment}"
}
