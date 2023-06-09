pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        // Checkout the repository
        checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[url: 'https://github.com/Mariott-Dev/reactclientapp']]])
      }
    }

    stage('Install Dependencies') {
      steps {
        // Install Node.js and npm
        // Adjust the tool name 'Node.js 14.x' according to your Jenkins configuration
        tool 'Node.js 18.12.1'
        
        // Install project dependencies
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        // Build the React application
        sh 'npm run build'
      }
    }

    stage('Test') {
      steps {
        // Run tests (if applicable)
        // Adjust the test command according to your project setup
        sh 'npm run test'
      }
    }

    stage('Package') {
      steps {
        // Archive the built application files
        archiveArtifacts(artifacts: 'build/**', fingerprint: true)
      }
    }
  }

  post {
    always {
      // Clean up by deleting node_modules and other temporary files
      deleteDir()
    }
  }
}

