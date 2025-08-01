# Frontend Helm Chart

This Helm chart deploys the Frontend application to a Kubernetes cluster.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- A container registry with the frontend image

## Installation

### Quick Start

```bash
# Add the chart repository (if using a chart repository)
# helm repo add fanno https://charts.fanno.io
# helm repo update

# Install the chart with default values
helm install frontend ./helm-charts/frontend

# Or install with custom values
helm install frontend ./helm-charts/frontend \
  --set image.tag=latest \
  --set replicaCount=5
```

### Using a values file

Create a custom `values.yaml` file:

```yaml
# custom-values.yaml
replicaCount: 5

image:
  repository: ghcr.io/fanoo2/frontend
  tag: "v1.0.0"

ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: frontend.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 200m
    memory: 256Mi
```

Then install:

```bash
helm install frontend ./helm-charts/frontend -f custom-values.yaml
```

## Configuration

The following table lists the configurable parameters and their default values.

### Global Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of frontend replicas | `3` |
| `nameOverride` | String to partially override frontend.fullname | `""` |
| `fullnameOverride` | String to fully override frontend.fullname | `""` |

### Image Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `image.repository` | Frontend image repository | `ghcr.io/fanoo2/frontend` |
| `image.pullPolicy` | Frontend image pull policy | `IfNotPresent` |
| `image.tag` | Frontend image tag | `""` |
| `imagePullSecrets` | Docker registry secret names | `[]` |

### Service Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `service.type` | Kubernetes Service type | `ClusterIP` |
| `service.port` | Service HTTP port | `80` |
| `service.targetPort` | Container HTTP port | `80` |

### Ingress Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ingress.enabled` | Enable ingress controller resource | `false` |
| `ingress.className` | Ingress class name | `""` |
| `ingress.annotations` | Ingress annotations | `{}` |
| `ingress.hosts` | Ingress hosts configuration | `[{host: "frontend.local", paths: [{path: "/", pathType: "Prefix"}]}]` |
| `ingress.tls` | Ingress TLS configuration | `[]` |

### Resource Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `resources.limits.cpu` | CPU limit | `200m` |
| `resources.limits.memory` | Memory limit | `256Mi` |
| `resources.requests.cpu` | CPU request | `100m` |
| `resources.requests.memory` | Memory request | `128Mi` |

### Autoscaling Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `autoscaling.enabled` | Enable horizontal pod autoscaler | `false` |
| `autoscaling.minReplicas` | Minimum number of replicas | `3` |
| `autoscaling.maxReplicas` | Maximum number of replicas | `10` |
| `autoscaling.targetCPUUtilizationPercentage` | Target CPU utilization | `80` |

### Health Check Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `healthCheck.enabled` | Enable health checks | `true` |
| `healthCheck.path` | Health check path | `/` |
| `healthCheck.initialDelaySeconds` | Initial delay for health checks | `10` |
| `healthCheck.periodSeconds` | Period for health checks | `30` |
| `healthCheck.timeoutSeconds` | Timeout for health checks | `5` |
| `healthCheck.failureThreshold` | Failure threshold for health checks | `3` |

## Usage Examples

### Production Deployment

```bash
helm install frontend ./helm-charts/frontend \
  --set image.tag=v1.2.3 \
  --set replicaCount=5 \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=frontend.production.com \
  --set resources.limits.cpu=500m \
  --set resources.limits.memory=512Mi \
  --set autoscaling.enabled=true \
  --namespace production
```

### Staging Deployment

```bash
helm install frontend-staging ./helm-charts/frontend \
  --set image.tag=staging \
  --set replicaCount=2 \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=frontend.staging.com \
  --namespace staging
```

### Development Deployment

```bash
helm install frontend-dev ./helm-charts/frontend \
  --set image.tag=dev \
  --set replicaCount=1 \
  --set resources.requests.cpu=50m \
  --set resources.requests.memory=64Mi \
  --namespace development
```

## Upgrading

```bash
# Upgrade to a new version
helm upgrade frontend ./helm-charts/frontend \
  --set image.tag=v1.3.0

# Upgrade with new values
helm upgrade frontend ./helm-charts/frontend -f new-values.yaml
```

## Uninstalling

```bash
helm uninstall frontend
```

## Troubleshooting

### Common Issues

1. **Image Pull Errors**
   ```bash
   # Check if the image exists and is accessible
   kubectl describe pod <pod-name>
   
   # Verify image pull secrets
   kubectl get secrets
   ```

2. **Service Not Accessible**
   ```bash
   # Check service endpoints
   kubectl get endpoints frontend
   
   # Check ingress configuration
   kubectl describe ingress frontend
   ```

3. **Pod Startup Issues**
   ```bash
   # Check pod logs
   kubectl logs -l app.kubernetes.io/name=frontend
   
   # Check pod events
   kubectl describe pod <pod-name>
   ```

### Health Check Verification

```bash
# Port-forward to test health checks locally
kubectl port-forward service/frontend 8080:80

# Test health endpoint
curl http://localhost:8080/
```

## Monitoring

The chart includes optional pod disruption budgets and horizontal pod autoscaling to ensure high availability.

### Metrics

If you have Prometheus monitoring set up, you can monitor:

- Pod CPU and memory usage
- Request rate and response times
- Pod restart counts
- Ingress traffic metrics

## Security

The chart follows security best practices:

- Runs as non-root user (UID 1000)
- Uses read-only root filesystem
- Drops all capabilities
- Sets security context appropriately

## Contributing

To contribute to this Helm chart:

1. Make changes to the templates or values
2. Test with `helm template` and `helm lint`
3. Validate with `helm install --dry-run`
4. Submit a pull request

## Support

For issues with this Helm chart, please:

1. Check the troubleshooting section above
2. Review the Kubernetes logs
3. Open an issue in the repository