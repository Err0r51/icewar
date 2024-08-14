param environment_name string = 'IcewarEnv'
param location string = 'westeurope'
param acrName string = 'icewarregistry'
param acrUsername string = 'icewarregistry'
@secure()
param acrPassword string
param containerImage string = 'crawler'
param commitHash string
param dbfqdn string = 'icecrawlercontainerapp.mangosand-6b3afca1.westeurope.azurecontainerapps.io'
param containerPort int = 80
@secure()
param postgresUser string
@secure()
param postgresPassword string
param time string = utcNow()

var logAnalyticsWorkspaceName = 'logs-${environment_name}'
var storageAccountName = 'storage${uniqueString(resourceGroup().id)}'
var fileShareName = 'dbdata'

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: {
    retentionInDays: 30
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource environment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: environment_name
  location: location
  properties: {
    vnetConfiguration: { 
      internal: false
     }
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

@description('Mounts a file share to the postgres container')
resource postgresMount 'Microsoft.App/managedEnvironments/storages@2024-03-01' = {
  parent: environment
  name: 'postgresmount'
  properties: {
    azureFile: {
      accountName: storageAccountName
      accessMode: 'ReadWrite'
      accountKey: storageAccount.listKeys().keys[0].value
      shareName: fileShareName
    }
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
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

resource fileServices 'Microsoft.Storage/storageAccounts/fileServices@2023-05-01' = {
  parent: storageAccount
  name: 'default'
}

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-05-01' = {
  parent: fileServices
  name: fileShareName
  properties: {
    shareQuota: 100
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'icecrawlercontainerapp'
  location: location
  dependsOn: [dbContainerApp]
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
            cpu: json('0.5')
            memory: '1.0Gi'
          }
          env: [
            {
              name: 'DATABASE_URL'
              value: 'postgresql://${postgresUser}:${postgresPassword}@icedbcontainerapp:5432/postgres?schema=public'
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
        allowInsecure: false
        targetPort: 5432
        exposedPort: 5432
        transport: 'TCP'
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
            cpu: json('0.5')
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
              mountPath: ' /var/lib/postgresql/foobar'
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
          storageName: 'postgresmount'
        }
      ]
    }
  }
}
