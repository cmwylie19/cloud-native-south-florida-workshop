import { K8s, kind } from "kubernetes-fluent-client";


const watcher = K8s(kind.Pod).Watch((pod, phase) => {
  console.log(`Pod ${pod.metadata?.name} is ${phase}`);
});

watcher.start();
