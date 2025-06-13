pipeline {
    agent any
    environment {
       GIT_REPO = 'ISIS3710_202510_S1_E2_Front'
       GIT_CREDENTIAL_ID = '7c21addc-0cbf-4f2e-9bd8-eced479c56c6'
       SONARQUBE_URL = 'http://157.253.238.75:8080/sonar-isis2603'
       SONAR_TOKEN = credentials('sonar-login')
    }
    stages {
       stage('Checkout') {
          steps {
             scmSkip(deleteBuild: true, skipPattern:'.*\\[ci-skip\\].*')
             git branch: 'main',
                credentialsId: env.GIT_CREDENTIAL_ID,
                url: 'https://github.com/isis3710-uniandes/' + env.GIT_REPO
          }
       }

       stage('Build') {
         steps {
            script {
               docker.image('nodetools-isis2603:latest').inside('-u root') {
                  sh '''
                     echo "🔹 Checking Node.js and npm versions..."
                     if ! command -v node > /dev/null; then
                        echo "❌ Node.js not installed in container!"
                        exit 1
                     fi
                     if ! command -v npm > /dev/null; then
                        echo "❌ npm not installed in container!"
                        exit 1
                     fi

                     echo "📂 Checking project files..."
                     ls -lah

                     if [ ! -f package.json ]; then
                        echo "❌ package.json not found! Check repository contents."
                        exit 1
                     fi

                     echo "🛠 Fixing permissions..."
                     chown -R root:root .

                     echo "⚡ Cleaning old dependencies..."
                     rm -rf node_modules
                     npm cache clean --force

                     echo "📦 Installing dependencies..."
                     npm ci --legacy-peer-deps || { echo "❌ npm install failed"; exit 1; }

                     echo "🚀 Running build..."
                     npm run build || { echo "❌ Build failed"; exit 1; }

                  '''
               }
            }
         }
      }

      stage('Test') {
          steps {
             script {
                docker.image('nodetools-isis2603:latest').inside('-u root') {
                   sh '''
                      echo "🧪 Running tests..."
                      CI=true npm run test -- --coverage . || { echo "❌ Tests failed"; exit 1; }
                   '''
                }
             }
          }
       }

       stage('Static Analysis') {
          steps {
             sh '''
                echo "🔍 Running static analysis with SonarQube..."
                docker run --rm -u root -e SONAR_HOST_URL=${SONARQUBE_URL} -e SONAR_TOKEN=${SONAR_TOKEN} -v ${WORKSPACE}:/usr/src sonarsource/sonar-scanner-cli || { echo "❌ SonarQube scan failed"; exit 1; }
             '''
          }
       }
    }

    post {
       always {
          echo "🧹 Cleaning workspace..."
          cleanWs deleteDirs: true
       }
    }
}
