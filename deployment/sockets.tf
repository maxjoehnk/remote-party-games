resource "docker_container" "sockets" {
  image = docker_image.sockets.latest
  name = "remote-party-games-sockets-${var.environment}"
  restart = "always"

  env = [
    "BROKER_URL=amqp://rabbitmq:5672"
  ]

  labels {
    label = "traefik.enable"
    value = "true"
  }

  labels {
    label = "traefik.http.routers.party-games-${var.environment}-sockets.rule"
    value = "Host(`${var.domain}`) && PathPrefix(`/api/socket`)"
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
    aliases = ["sockets"]
  }
}

resource "docker_image" "sockets" {
  name = data.docker_registry_image.sockets.name
  pull_triggers = [data.docker_registry_image.sockets.sha256_digest]
  keep_locally = true
}

data "docker_registry_image" "sockets" {
  name = "registry.gitlab.com/maxjoehnk/remote-party-games/sockets:${var.tag}"
}
