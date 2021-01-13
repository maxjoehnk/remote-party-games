resource "docker_container" "matchmaking" {
  image = docker_image.matchmaking.latest
  name = "remote-party-games-matchmaking-${var.environment}"
  restart = "always"

  labels {
    label = "traefik.enable"
    value = "true"
  }

  labels {
    label = "traefik.http.routers.party-games-${var.environment}-matchmaking.rule"
    value = "Host(`${var.domain}`) && PathPrefix(`/api`)"
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
}

data "docker_registry_image" "matchmaking" {
  name = "registry.gitlab.com/maxjoehnk/remote-party-games/matchmaking:${var.tag}"
}
