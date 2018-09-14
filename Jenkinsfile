
node('docker') {

    def img
    def version
    def commit
    def artifactName
    def s3BasePath = "cdncliqz/update/re-consent"

    stage ('Checkout') {
        def checkoutInfo = checkout scm
        commit = checkoutInfo.GIT_COMMIT
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

    stage('Upload Artifact') {
        // tag artifact with commit id
        artifactName = "re-consent-${version}-${commit.substring(0, 7)}.zip"
        def uploadLocation = "s3://${s3BasePath}/${env.BRANCH_NAME}/${artifactName}"
        currentBuild.description = uploadLocation
        sh "mv build/re-consent-${version}.zip build/${artifactName}"
        withS3Credentials {
            sh "aws s3 cp build/${artifactName} ${uploadLocation} --acl public-read"
        }
    }

    if (env.BRANCH_NAME == 'master') {
        stage('Sign Extension') {
            def artifactUrl = "https://s3.amazonaws.com/${s3BasePath}/${env.BRANCH_NAME}/${artifactName}"
            build job: 'addon-repack', parameters: [
                string(name: 'XPI_URL', value: artifactUrl),
                string(name: 'XPI_SIGN_CREDENTIALS', value: '41572f9c-06aa-46f0-9c3b-b7f4f78e9caa'),
                string(name: 'XPI_SIGN_REPO_URL', value: 'git@github.com:cliqz/xpi-sign.git'),
                string(name: 'CHANNEL', value: 'browser')
            ]
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