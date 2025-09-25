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

3. Apply the RBAC binding once:
```bash
kubectl create clusterrolebinding terraform-admin-binding \
  --clusterrole=cluster-admin \
  --user=terraform-admin@x-object-472022-q2.iam.gserviceaccount.com
```

