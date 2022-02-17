resource "docker_container" "matchmaking" {
  image = docker_image.matchmaking.latest
  name = "remote-party-games-matchmaking-${var.environment}"
  restart = "always"

  env = [
    "UNLEASH_ENVIRONMENT=${var.environment}",
    "UNLEASH_URL=${var.unleash_url}",
    "UNLEASH_INSTANCE_ID=${var.unleash_instance_id}",
    "BROKER_URL=amqp://rabbitmq:5672"
  ]

  labels {
    label = "traefik.enable"
    value = "true"
  }

  labels {
    label = "traefik.http.routers.party-games-${var.environment}-matchmaking.rule"
    value = "Host(`${var.domain}`) && PathPrefix(`/api`)"
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
    aliases = ["matchmaking"]
  }
}

resource "docker_image" "matchmaking" {
  name = data.docker_registry_image.matchmaking.name
  pull_triggers = [data.docker_registry_image.matchmaking.sha256_digest]
  keep_locally = true
}

data "docker_registry_image" "matchmaking" {
  name = "registry.gitlab.com/maxjoehnk/remote-party-games/matchmaking:${var.tag}"
}
