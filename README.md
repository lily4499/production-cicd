# Production CI/CD Demo

This project demonstrates a **CI/CD pipeline** for deploying a Node.js app to Kubernetes using **Jenkins, DockerHub, Helm, and optional Terraform**.

## 🚀 Flow
1. Code pushed to GitHub
2. Jenkins pipeline builds Docker image
3. Trivy scans image for vulnerabilities
4. Push to DockerHub
5. Deploy with Helm to Kubernetes
6. Rollback automatically if deployment fails

## 📂 Project Structure
- `app/` → Node.js app
- `helm-chart/` → Helm deployment
- `terraform/` → (Optional) infra setup
- `Jenkinsfile` → CI/CD pipeline


```bash
export GOOGLE_APPLICATION_CREDENTIALS="/home/lilia/DevOps/testtest/terraform-sa.json"
terraform init
terraform plan
terraform apply --auto-approve
```

1. Log in with your GCP user (not the service account Jenkins uses):
```bash
gcloud auth login
gcloud container clusters get-credentials gke-demo --zone us-east4-a --project x-object-472022-q2
```

2. Apply the RBAC binding once:
```bash
kubectl create clusterrolebinding terraform-admin-binding \
  --clusterrole=cluster-admin \
  --user=terraform-admin@x-object-472022-q2.iam.gserviceaccount.com

```

---

---

 A **rollback demonstration** in this CI/CD project is best done with **Helm**, since it natively supports rolling back to a previous deployment.

---

## 🔹 1. Deploy Your App (Initial Version)

```bash
helm upgrade --install prod-cicd ./helm-chart \
  --set image.repository=laly9999/prod-cicd-app \
  --set image.tag=1
```

Check pods and service:

```bash
kubectl get pods
kubectl get svc
```

✅ App is running fine.

---

## 🔹 2. Push a Broken Version

Update your app (e.g., introduce a bug or use a bad image tag):

```bash
helm upgrade --install prod-cicd ./helm-chart \
  --set image.repository=laly9999/prod-cicd-app \
  --set image.tag=999
```

Kubernetes will try to roll out the new version → Pods may crash.

Check status:

```bash
kubectl get pods
kubectl describe pod <pod-name>
```

❌ You’ll see `CrashLoopBackOff` or failing pods.

---

## 🔹 3. Roll Back with Helm

Run rollback:

```bash
helm rollback prod-cicd 1
```

* `prod-cicd` = release name
* `1` = revision number (you can check with `helm history prod-cicd`)

Verify rollback worked:

```bash
kubectl get pods
kubectl get svc
```

✅ Healthy pods are restored from the last good deployment.

---

## 🔹 4. Demonstration Flow for YouTube / PPTX

* Show **helm history prod-cicd** → multiple revisions
* Deploy a **bad version** → show pods failing
* Run **helm rollback prod-cicd 1**
* Show pods recovering + app working again in browser

---





