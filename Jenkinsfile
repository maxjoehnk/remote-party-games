node {
    checkout scm
    docker.withRegistry('https://docker.pkg.github.com', 'github') {
        stage('Build Web Client') {
            docker.build("docker.pkg.github.com/maxjoehnk/remote-party-games/web-client:latest", './applications/web-client').push()
        }

        stage('Build Matchmaking') {
            docker.build("docker.pkg.github.com/maxjoehnk/remote-party-games/matchmaking:latest", '-f applications/matchmaking/Dockerfile .').push()
        }

        stage('Build Proxy') {
            docker.build("docker.pkg.github.com/maxjoehnk/remote-party-games/proxy:latest", './applications/proxy').push()
        }
    }
}
