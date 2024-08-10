param location string = resourceGroup().location
param containerAppName string
param environmentName string
param acrName string
param acrUsername string

@secure()
param acrPassword string
param containerImage string
param commitHash string
param containerPort int = 80

// Container App Environment
resource containerAppEnv 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: environmentName
  location: location
}

// Secret for ACR password
resource acrPasswordSecret 'Microsoft.App/containerApps/secrets@2022-03-01' = {
  parent: containerApp
  name: 'acrPassword'
  properties: {
    value: acrPassword
  }
}

// Container App
resource containerApp 'Microsoft.App/containerApps@2022-03-01' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: containerPort
        transport: 'auto'
      }
      registries: [
        {
          server: '${acrName}.azurecr.io'
          username: acrUsername
          passwordSecretRef: 'acrPassword'
        }
      ]
    }
    template: {
      containers: [
        {
          name: containerAppName
          image: '${acrName}.azurecr.io/${containerImage}:${commitHash}'
          resources: {
            cpu: 1.0
            memory: '1.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}
