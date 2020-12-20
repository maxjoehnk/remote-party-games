node {
    checkout scm
    docker.withRegistry('https://docker.pkg.github.com', 'github') {
        stage('Build Web Client') {
            docker.build("docker.pkg.github.com/maxjoehnk/remote-party-games/web-client:latest", '-f applications/web-client/Dockerfile .').push()
        }

        stage('Build Matchmaking') {
            docker.build("docker.pkg.github.com/maxjoehnk/remote-party-games/matchmaking:latest", '-f applications/matchmaking/Dockerfile .').push()
        }

        stage('Build Proxy') {
            docker.build("docker.pkg.github.com/maxjoehnk/remote-party-games/proxy:latest", './applications/proxy').push()
        }

        stage('Build Image Service') {
            docker.build("docker.pkg.github.com/maxjoehnk/remote-party-games/image:latest", '-f applications/image/Dockerfile .').push()
        }
    }
}
