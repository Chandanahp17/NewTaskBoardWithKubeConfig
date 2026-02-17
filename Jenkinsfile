pipeline {
  agent { label 'chandana-kube' }

  environment {
    DOCKER_REPO = "chandanahp"
    BACKEND_IMAGE = "taskboard-backend"
    FRONTEND_IMAGE = "taskboard-frontend"
  }

  triggers {
    pollSCM('H/5 * * * *')
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Check Docker') {
      steps {
        sh "docker --version"
      }
    }

    stage('Build Backend Image') {
      steps {
        sh """
          docker build -t $DOCKER_REPO/$BACKEND_IMAGE:$BUILD_NUMBER ./backend
        """
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh """
          docker build -t $DOCKER_REPO/$FRONTEND_IMAGE:$BUILD_NUMBER ./frontend
        """
      }
    }

stage('Push Docker Image') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'chandana-dockerhub-creds',
                usernameVariable: 'DOCKERHUB_USER',
                passwordVariable: 'DOCKERHUB_PASS'
            )
        ]) {
            sh '''
                echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                docker push chandanahp/taskboard-backend:$BUILD_NUMBER
                docker push chandanahp/taskboard-frontend:$BUILD_NUMBER
                docker logout
            '''
        }
    }
}


    stage('Update K8s Deployment') {
      steps {
        sh """
          kubectl set image deployment/backend \
          backend=$DOCKER_REPO/$BACKEND_IMAGE:$BUILD_NUMBER -n taskboard

          kubectl set image deployment/frontend \
          frontend=$DOCKER_REPO/$FRONTEND_IMAGE:$BUILD_NUMBER -n taskboard
        """
      }
    }

    stage('Verify Rollout') {
      steps {
        sh """
          kubectl rollout status deployment/backend -n taskboard
          kubectl rollout status deployment/frontend -n taskboard
        """
      }
    }

    stage('Check Kubernetes Resources') {
      steps {
        sh """
          kubectl get pods -n taskboard
          kubectl get svc -n taskboard
        """
      }
    }
  }
}
