param environment_name string = 'IcewarEnv'
param location string = 'westeurope'
param acrName string = 'icewarregistry'
param acrUsername string = 'icewarregistry'
@secure()
param acrPassword string
param containerImage string = 'crawler'
param commitHash string
param containerPort int = 80

var logAnalyticsWorkspaceName = 'logs-${environment_name}'

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2020-03-01-preview' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: {
    retentionInDays: 30
    features: {
      searchVersion: 1
    }
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource environment 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: environment_name
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'icecrawlercontainerapp'
  location: location
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      secrets: [
        {
          name: 'containerregistrypasswordref'
          value: acrPassword
        }
      ]
      ingress: {
        external: true
        targetPort: containerPort
      }
      registries: [
        {
          server: '${acrName}.azurecr.io'
          username: acrUsername
          passwordSecretRef: 'containerregistrypasswordref'
        }
      ]
    }
    template: {
      containers: [
        {
          image: '${acrName}.azurecr.io/${containerImage}:${commitHash}'
          name: 'icecrawlercontainerapp'
          resources: {
            cpu: '0.5'
            memory: '1.0Gi'
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

resource containerapp 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'icedbcontainerapp'
  location: location
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      ingress: {
        external: true
        targetPort: containerPort
      }
    }
    template: {
      containers: [
        {
          image: '${acrName}.azurecr.io/${containerImage}:${commitHash}'
          name: 'icecrawlercontainerapp'
          resources: {
            cpu: '0.5'
            memory: '1.0Gi'
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
