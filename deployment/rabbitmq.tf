resource "docker_container" "rabbitmq" {
  image = docker_image.rabbitmq.latest
  name = "remote-party-games-rabbitmq-${var.environment}"
  restart = "always"

  networks_advanced {
    name = docker_network.internal.name
    aliases = ["rabbitmq"]
  }
}

resource "docker_image" "rabbitmq" {
  name = data.docker_registry_image.rabbitmq.name
  pull_triggers = [data.docker_registry_image.rabbitmq.sha256_digest]
  keep_locally = true
}

data "docker_registry_image" "rabbitmq" {
  name = "rabbitmq:3.9"
}
