pipeline {
  agent any
  
  stages {
    stage('Checkout') {
      steps {
        // Checkout your source code from version control (e.g., Git)
        git url: 'https://github.com/Mariott-Dev/reactclientapp'
      }
    }
    
    stage('Install dependencies') {
      steps {
        // Install Node.js and NPM
        sh 'curl -sL https://deb.nodesource.com/setup_14.x | bash -'
        sh 'apt-get install -y nodejs'
        
        // Install project dependencies using NPM
        sh 'npm ci'
      }
    }
    
    stage('Build') {
      steps {
        // Build the React application
        sh 'npm run build'
      }
    }
    
    stage('Publish artifacts') {
      steps {
        // Archive the built artifacts for later use (e.g., deployment)
        archiveArtifacts 'build/**'
      }
    }
  }
}
