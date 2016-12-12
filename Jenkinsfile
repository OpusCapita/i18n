def notifyBuild(String buildStatus = '') {
  def color = '#FF0000'

  def slackJob = "<${env.JOB_URL}|${env.JOB_NAME}>  — #${env.BUILD_NUMBER}"
  def slackLinks = "<${env.BUILD_URL}|build> | <${env.BUILD_URL}/changes|changes> | <${env.BUILD_URL}/console|log> | <${env.BUILD_URL}/parameters|params>"
  def slackMessage = "*${slackJob}* *( ${slackLinks} )*"

  if (buildStatus == 'SUCCESS') {
    color = '#36a64f'
  } else {
    color = '#d00000'
  }

  slackSend (color: color, message: slackMessage)
}

node {
  def buildStats = 'STARTED'
  try {
    stage('configure tools') {
      def nodeHome = tool name: 'Node6-LTS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
      def yarnHome = tool name: 'yarn-0.18.0', type: 'com.cloudbees.jenkins.plugins.customtools.CustomTool'
      def mvnHome = tool name: 'maven3', type: 'maven'
      env.JAVA_HOME = tool name: 'jdk1.8.0_31', type: 'jdk'
      env.PATH = "${mvnHome}/bin:${yarnHome}/dist/bin:${nodeHome}/bin:${env.PATH}"
    }
    stage('checkout sources') {
      checkout scm
      sh "git clean -df"
    }

// Start stages. Placed here by @opuscapita/npm-scripts

    stage('install dependencies (yarn)') {
  sh "yarn"
}
stage('lint code') {
  sh "npm run lint"
}
stage('run test') {
  sh "npm run test"
}
stage('deploy') {
  if(env.RELEASE == 'TRUE') {
    sh "npm run publish-release"
  } else {
    sh "npm run publish-snapshot"
  }
}

// End stages. Placed here by @opuscapita/npm-scripts

    buildStatus = 'SUCCESS'
  } catch (err) {
    buildStatus = 'FAILURE'
    throw err
  } finally {
    sh "echo 'CURRENT BUILD: ${currentBuild.duration}'"
    notifyBuild(buildStatus)
  }
}
