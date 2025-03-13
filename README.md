# Kubernetes Watch


Kubernetes Watch reports changes on the resource defined by the URL and is configured through the query string. 

- It is the mechanism that backs Pepr Watch and Reconcile. 
- It is how Kubernetes Controllers and Informers track changes to resources
- It can return several content-types like JSON, YAML, protobuf, CBOR and probably more

### URL Construction

Core resources use `/api` and omit group, others use `/apis`

```plaintext
/apis/GROUP/VERSION/namespaces/NAMESPACE/*
```

Examples: 

```plaintext
/api/v1/namespaces
/api/v1/pods
/api/v1/namespaces/my-namespace/pods
/apis/apps/v1/deployments
/apis/apps/v1/namespaces/my-namespace/deployments
/apis/apps/v1/namespaces/my-namespace/deployments/my-deployment
```

Demo:

Proxy kube-apiserver locally

```bash
kubectl proxy&
````

Create a pod

```bash
kubectl run n --image=nginx 
```

Get a list of pods across all namespaces `kubectl get po -A`

```bash
curl "localhost:8001/api/v1/pods" | jq '.items[].metadata.name' 
```

Get a list of pods from default namespace

```bash
curl "localhost:8001/api/v1/namespaces/default/pods" | jq '.items[].metadata.name' 
```

Get a specific pod

```bash
curl "localhost:8001/api/v1/namespaces/default/pods/n" | jq '{name: .metadata.name, resourceVersion: .metadata.resourceVersion}'
```

### Query Params

Query params are how you configure how you get resources. The ones that I am aware of are:
- watch _bool_ - Sends back back events ([KFC](https://github.com/defenseunicorns/kubernetes-fluent-client/blob/efd691f52860b2dc304ba3b1a8d1dc77968cd16d/src/fluent/watch.ts#L223))
- resourceVersion _int_ - A pod at a given state in time, resourceVersion increments up ([KFC](https://github.com/defenseunicorns/kubernetes-fluent-client/blob/efd691f52860b2dc304ba3b1a8d1dc77968cd16d/src/fluent/watch.ts#L237))
- allowWatchBookmarks _bool_ - Send bookmark events indicating whether new events have happened (not used in KFC)
- labelSelector _map[string]string_ - Obvious (not used in KFC)
- fieldSelector _map[string]string_ - Selector for given fields ([used only for `metadata.name` in KFC](https://github.com/defenseunicorns/kubernetes-fluent-client/blob/efd691f52860b2dc304ba3b1a8d1dc77968cd16d/src/fluent/watch.ts#L232))

_ResourceVersion only gets re-assigned in KFC during a relist event._

Demo:

Start a watch all pods since from no particular resource version

```bash
curl -N --no-buffer "http://localhost:8001/api/v1/pods?watch=true" | jq '{name: .object.metadata.name, type: .type, resourceVersion: .object.metadata.resourceVersion}'
```

Label the pod to trigger an `MODIFIED` event

```bash
k label po/n color=red
```

```json
  "type": "MODIFIED",
```

Use the fieldSelector to watch pods where name is `n`

```bash
curl -N --no-buffer "http://localhost:8001/api/v1/pods?watch=true&fieldSelector=metadata.name=n" | jq '{name: .object.metadata.name, type: .type, resourceVersion: .object.metadata.resourceVersion}'
```

Trigger a new `MODIFIED` event

```bash
k label po/n color=blue --overwrite
```

```json
  "type": "MODIFIED",
```

Create a new pod with name n in a new namespace

```bash
k run n -n kube-public --image=nginx
```

```json
  "type": "MODIFIED",
```
... :open_mouth: _says modified but it is a new pod_

We need to be more specific, lets re-do our watch and include namespace in the fieldSelector

```bash
curl -N --no-buffer "http://localhost:8001/api/v1/pods?watch=true&fieldSelector=metadata.name=n,metadata.namespace=kube-public" | jq '{name: .object.metadata.name, type: .type, resourceVersion: .object.metadata.resourceVersion}'
```

```json
  "type": "ADDED",
```

### What else can we do 

subresources

Get logs from n

```bash
curl "http://localhost:8001/api/v1/namespaces/default/pods/n/log" 
```

Pull node metrics ( I am using k3d with metric server)

```bash
 # find the name of a node
curl -N --no-buffer "http://localhost:8001/apis/metrics.k8s.io/v1beta1/nodes/$(kubectl get nodes -o json | jq -r '.items[0].metadata.name')" | jq
```

### Summary

Pepr's watch/reconcile program the Watch class in KFC to watch a given resource. The watch starts watching from a given resource version and acting upon events when it dispatches the info back to the Pepr callbacks.
