def applications = ["web-client", "matchmaking", "proxy"]

node {
    checkout scm
    docker.withRegistry('https://docker.pkg.github.com', 'github') {
        stage('Build') {
            def stages = [:]

            for (application in applications) {
                stages["${application}"] = {
                    stage("${application}") {
                        docker.build("docker.pkg.github.com/maxjoehnk/remote-party-games/${application}:latest", "./applications/${application}").push()
                    }
                }
            }

            parallel stages
        }
    }
}
