terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~>5.0"
    }
  }
}

provider "google" {
  project = "x-object-472022-q2"
  region  = "us-east4"
}

resource "google_container_cluster" "gke" {
  name               = "gke-demo"
  location           = "us-east4-a"      # 👈 Zonal cluster (only 1 zone, cheaper)
  initial_node_count = 1                 # 👈 Start with 1 node only

  deletion_protection = false

  node_config {
    machine_type = "e2-small"            # 👈 Cheaper VM (2 vCPU, 2GB RAM)
    disk_size_gb = 30                    # 👈 Smaller boot disk
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }
}
