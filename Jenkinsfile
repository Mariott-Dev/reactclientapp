pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo "Building react user interface.."
                sh '''
                npm install
                '''
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
                sh '''
                echo "Enter Test Protocols Here (for UI)."
                '''
            }
        }
        stage('Deliver') {
            steps {
                echo 'Deliver....'
                sh '''
                echo "Enter Delivery Protcols Here (for UI)."
                '''
            }
        }
    }
}
