param environment_name string = 'IcewarEnv'
param location string = 'westeurope'
param acrName string = 'icewarregistry'
param acrUsername string = 'icewarregistry'
@secure()
param acrPassword string
param containerImage string = 'crawler'
param commitHash string
param containerPort int = 80
@secure()
param postgresUser string
@secure()
param postgresPassword string

var logAnalyticsWorkspaceName = 'logs-${environment_name}'
var storageAccountName = 'storage${uniqueString(resourceGroup().id)}'
var fileShareName = 'dbdata'

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2020-03-01-preview' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: {
    retentionInDays: 30
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

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}

resource fileServices 'Microsoft.Storage/storageAccounts/fileServices@2021-04-01' = {
  parent: storageAccount
  name: 'default'
}

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-04-01' = {
  parent: fileServices
  name: fileShareName
  properties: {
    shareQuota: 100
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'icecrawlercontainerapp'
  location: location
  dependsOn: [ dbContainerApp]
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      secrets: [
        {
          name: 'containerregistrypasswordref'
          value: acrPassword
        }
        {
          name: 'postgres-user'
          value: postgresUser
        }
        {
          name: 'postgres-password'
          value: postgresPassword
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
          env: [
            {
              name: 'DATABASE_URL'
              value: 'postgres://${postgresUser}:${postgresPassword}@icedbcontainerapp:5432/postgres'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

resource dbContainerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'icedbcontainerapp'
  location: location
  dependsOn: [
    fileShare
  ]
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 5432
      }
      secrets: [
        {
          name: 'postgres-user'
          value: postgresUser
        }
        {
          name: 'postgres-password'
          value: postgresPassword
        }
      ]
    }
    template: {
      containers: [
        {
          image: 'postgres:16.3'
          name: 'icedbcontainerapp'
          resources: {
            cpu: '0.5'
            memory: '1.0Gi'
          }
          env: [
            {
              name: 'POSTGRES_USER'
              secretRef: 'postgres-user'
            }
            {
              name: 'POSTGRES_PASSWORD'
              secretRef: 'postgres-password'
            }
          ]
          volumeMounts: [
            {
              volumeName: 'dbdatavolume'
              mountPath: '/var/lib/postgresql/data'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
      volumes: [
        {
          name: 'dbdatavolume'
          storageType: 'AzureFile'
          storageName: storageAccount.name
        }
      ]
    }
  }
}
