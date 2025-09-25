pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "laly9999/prod-cicd-app"
        IMAGE_TAG    = "${BUILD_NUMBER}"   // 👈 this must be declared here
        REGISTRY_CREDENTIALS = credentials('dockerhub-credentials')
        SLACK_WEBHOOK        = credentials('slack-webhook')

        GCP_PROJECT  = "x-object-472022-q2"
        GCP_ZONE     = "us-east4-a"
        GKE_CLUSTER  = "gke-demo"
    }

    stages {
        stage('Build') {
            steps {
                dir('app') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                dir('app') {
                    sh 'npm test'
                }
            }
        }

       stage('Run SonarQube') {
            environment {
                scannerHome = tool 'sonar-scan'
            }
            steps {
                dir('app') {   // 👈 run commands inside app/
                    withSonarQubeEnv('MySonar') {
                        sh '''
                            # Run tests with coverage inside app/
                            npm test -- --coverage --coverageReporters=lcov
        
                            # Run SonarQube analysis
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=sonar-app-key \
                              -Dsonar.sources=. \
                              -Dsonar.tests=__tests__ \
                              -Dsonar.test.inclusions=__tests__/**/*.test.js \
                              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        '''
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                // sh 'docker build --no-cache -t $DOCKER_IMAGE:$IMAGE_TAGE ./app'

                sh 'docker build -t $DOCKER_IMAGE:$IMAGE_TAG ./app'
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh "trivy image --exit-code 1 --severity CRITICAL $DOCKER_IMAGE"

                // sh "trivy image --exit-code 1 --severity HIGH,CRITICAL $DOCKER_IMAGE"
            }
        }

        stage('Push Docker Image') {
            steps {
                sh """
                    echo $REGISTRY_CREDENTIALS_PSW | docker login -u $REGISTRY_CREDENTIALS_USR --password-stdin
        
                    # Push with the correct tag (BUILD_NUMBER)
                    docker push $DOCKER_IMAGE:$IMAGE_TAG
                """
            }
        }

        // stage('Terraform Provisioning (Optional)') {
        //     when {
        //         expression { fileExists('terraform/main.tf') }
        //     }
        //     steps {
        //         dir('terraform') {
        //             sh '''
        //               terraform init
        //               terraform apply -auto-approve
        //             '''
        //         }
        //     }
        // }




        stage('Deploy to Kubernetes') {
            steps {
                dir('helm-chart') {
                    withCredentials([file(credentialsId: 'gcp-sa-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                        sh """
                            export USE_GKE_GCLOUD_AUTH_PLUGIN=True
                            gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                            gcloud config set project $GCP_PROJECT
                            gcloud container clusters get-credentials $GKE_CLUSTER --zone $GCP_ZONE --project $GCP_PROJECT
        
                            helm upgrade --install prod-cicd . \
                              --set image.repository=$DOCKER_IMAGE \
                              --set image.tag=$IMAGE_TAG
                        """
                    }
                }
            }
        }
    }
    post {
        success {
            script {
                slackSend(
                    channel: '#devops-project',
                    message: "✅ Jenkins: Deployment successful for ${DOCKER_IMAGE}"
                )
            }
        }
        failure {
            echo "Deployment failed ❌ → Rolling back..."
            withCredentials([file(credentialsId: 'gcp-sa-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                sh """
                  export USE_GKE_GCLOUD_AUTH_PLUGIN=True
                  gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                  gcloud config set project $GCP_PROJECT
                  gcloud container clusters get-credentials $GKE_CLUSTER --zone $GCP_ZONE --project $GCP_PROJECT
                  helm rollback prod-cicd 0 || true
                """
            }
            script {
                slackSend(
                    channel: '#devops-project',
                    message: "❌ Jenkins: Deployment FAILED for ${DOCKER_IMAGE}. Rolled back to last stable release."
                )
            }
        }
    }
}
