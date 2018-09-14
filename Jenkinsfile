
node('docker') {

    def img
    def version
    def commit

    stage ('Checkout') {
        def checkoutInfo = checkout scm
        commit = checkoutInfo.GIT_COMMIT
        print commit
    }

    stage('Build Docker Image') {
        img = docker.build('reconsent/build', '--build-arg UID=`id -u` --build-arg GID=`id -g` .')
    }

    stage('Build Extension') {
        img.inside() {
            version = sh(returnStdout: true, script: 'node -p "require(\'./package.json\').version"').trim()
            sh 'cp -R /app/node_modules ./'
            sh 'npm run build'
        }
    }

    stage('Upload artifact') {
        // tag artifact with commit id
        def artifactName = "re-consent-${version}-${commit.substring(0, 7)}.zip"
        def uploadLocation = "s3://cdncliqz/update/re-consent/${env.BRANCH_NAME}/${artifactName}"
        sh "mv build/re-consent-${version}.zip build/${artifactName}"
        print artifactName
        sh 'ls -la build/'
        withS3Credentials {
            sh "aws s3 cp build/${artifactName} ${uploadLocation} --acl public-read"
        }
    }
}

def withS3Credentials(Closure body) {
    withCredentials([[
            $class: 'UsernamePasswordMultiBinding',
            credentialsId: '06ec4a34-9d01-46df-9ff8-64c79eda8b14',
            passwordVariable: 'AWS_SECRET_ACCESS_KEY',
            usernameVariable: 'AWS_ACCESS_KEY_ID']]) {
        body()
    }
}