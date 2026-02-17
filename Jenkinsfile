pipeline {
    agent { label 'chandana-kube' }

    environment {
        BACKEND_IMAGE = "chandanahp/taskboard-backend"
        FRONTEND_IMAGE = "chandanahp/taskboard-frontend"
        K8S_NAMESPACE = "taskboard"
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Docker CLI') {
            steps {
                sh "docker --version"
                sh "docker ps -a"
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Use Jenkins build number as image tag
                    env.IMAGE_TAG = "${BUILD_NUMBER}"
                }
                sh """
                    docker build -t $BACKEND_IMAGE:$IMAGE_TAG backend
                    docker build -t $FRONTEND_IMAGE:$IMAGE_TAG frontend
                """
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'chandana-dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_PASS'
                    )
                ]) {
                    sh """
                        echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                        docker push $BACKEND_IMAGE:$IMAGE_TAG
                        docker push $FRONTEND_IMAGE:$IMAGE_TAG
                        docker logout
                    """
                }
            }
        }

        stage('Update Kubernetes Deployments') {
            steps {
                sh """
                    kubectl set image deployment/backend backend=$BACKEND_IMAGE:$IMAGE_TAG -n $K8S_NAMESPACE
                    kubectl set image deployment/frontend frontend=$FRONTEND_IMAGE:$IMAGE_TAG -n $K8S_NAMESPACE
                """
            }
        }

        stage('Verify Rollout') {
            steps {
                sh """
                    kubectl rollout status deployment/backend -n $K8S_NAMESPACE
                    kubectl rollout status deployment/frontend -n $K8S_NAMESPACE
                """
            }
        }

        stage('Application Health Check') {
            steps {
                sh """
                    sleep 10
                    curl -f http://<NODE_IP>:<NODE_PORT> || exit 1
                """
            }
        }
    }
}
