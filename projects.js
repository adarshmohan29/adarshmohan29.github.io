/*
 * Projects shown on the site.
 * To add a project (e.g. Gatekeeper), copy one object and change the fields.
 *   repo       – exact GitHub repo name under GITHUB_USER (used for the README + GitHub link)
 *   readmePath – optional: path to the README if it isn't at the repo root
 *   localReadme – optional: markdown shown instead of fetching from GitHub
 *   status     – optional: "In progress" etc. (shows a badge)
 *   hideSections – optional: README section headings to leave out of the popup
 */
const GITHUB_USER = "adarshmohan29";

const PROJECTS = [
  {
    repo: "Safe-Research",
    title: "Adaptive Multi-Layer Feature Fusion for Multitask Failure Detection in VLA Models",
    tagline:
      "Research extending SAFE (NeurIPS '25) to predict when vision-language-action robot policies are about to fail, using features fused from multiple model layers.",
    highlights: ["Multi-layer feature fusion detectors on OpenVLA", "Zero-shot failure detection on unseen LIBERO tasks"],
    tech: ["Python", "PyTorch", "OpenVLA", "LIBERO", "Slurm / Modal"],
    category: "Research · Robotics ML",
    status: "In progress",
    localReadme: `# SAFE Research: Failure Detection for Vision-Language-Action Models

*Ongoing team research project.*

## The problem
Vision-Language-Action (VLA) models such as **OpenVLA** let a robot follow natural-language instructions ("put the bowl in the drawer") directly from camera images. But when they fail, they usually fail silently: the robot keeps moving with no sign that anything is wrong. For real deployment we need a **failure detector** that warns early that a rollout is going wrong, including on **tasks it has never seen before**.

## Background
This work builds on **SAFE: Multitask Failure Detection for Vision-Language-Action Models** (Gu et al., NeurIPS 2025, [project page](https://vla-safe.github.io/)). SAFE showed that the VLA's own internal features carry a general "this is going to fail" signal, and trained a lightweight detector on them that transfers zero-shot to unseen tasks. The original SAFE code is kept intact in the repository and credited to its authors.

## What we're building
Our research asks whether failure signals are spread across **different depths of the model**, and whether combining them beats SAFE's single-layer approach.

- **Multi-layer feature extraction:** a patched OpenVLA captures hidden states from several transformer layers (e.g. layers 8, 16, 24 and 32) during each rollout.
- **Versioned feature store:** features are cached once, with metadata (checkpoint, layers, pooling, dtype, split version), so detectors train quickly without reloading the 7B model.
- **Fusion detectors:** a registry of models compared side by side, including gated fusion, residual fusion, concat fusion, single-layer probes, and the original SAFE MLP/LSTM baselines.
- **Layer probing** to measure which depths carry the most failure signal.
- **Strict evaluation protocol:** all tuning uses held-out *seen* tasks; *unseen* tasks are used only for the final evaluation (ROC-AUC, PR-AUC, TPR at fixed FPR).
- **Reproducible GPU pipeline:** LIBERO simulation rollouts run on Modal (A10) and USC's CARC cluster (Slurm), with environment fingerprints and checksums. Every run is tracked in an experiment index.

## Status
In progress. The rollout collection and feature-caching pipeline is built and tested, and the first experiment (adaptive gated fusion on LIBERO-10) is set up. Results are still to come.

## Stack
Python · PyTorch · OpenVLA · LIBERO · Hydra · Weights & Biases · Slurm · Modal`,
  },
  {
    repo: "batchstream-inference-engine",
    title: "BatchStream Inference Engine",
    tagline:
      "LLM inference server with a continuous-batching scheduler, KV-cache memory manager and SSE streaming API.",
    highlights: ["2.55× peak throughput vs one-at-a-time serving", "p99 latency 16.3s → 2.2s at 4 req/s"],
    tech: ["Python", "PyTorch", "C++", "llama.cpp", "SSE"],
    category: "Systems · ML",
  },
  {
    repo: "TriageMesh",
    title: "TriageMesh",
    tagline:
      "AI incident-investigation orchestrator: parallel evidence gathering, conflict resolution, ranked root causes and policy-gated remediation.",
    highlights: ["3.0× faster with request hedging", "100% top-1 root cause vs 75% ReAct baseline"],
    tech: ["TypeScript", "Node.js", "MCP", "LLM Agents"],
    category: "AI Agents",
  },
  {
    repo: "Tripwire-Event-Driven-Automation",
    title: "Tripwire",
    tagline:
      "Webhook-driven YAML workflow engine on Postgres, with a chaos harness proving no lost events and no duplicate side effects.",
    highlights: ["Exactly-once side effects under retries & crashes", "Postgres as datastore and queue"],
    tech: ["TypeScript", "Postgres", "Webhooks", "Chaos testing"],
    category: "Backend",
  },
  {
    repo: "Cloud-Dock",
    title: "CloudDock",
    tagline:
      "Bring-your-own-cloud platform that takes a GitHub repo to a running deployment with automated Docker builds.",
    highlights: ["GitHub OAuth + automatic branch retrieval", "6-stage dynamic deployment workflow"],
    tech: ["React", "Node.js", "Express", "Docker", "AWS"],
    category: "Cloud · DevOps",
  },
  {
    repo: "Deep-learning-fungal-classification",
    title: "Fungal Species Classification",
    tagline:
      "Transfer-learning study on the DeFungi dataset comparing five CNN backbones for fungal species recognition.",
    highlights: ["ResNet50/101, EfficientNet-B0, VGG16, DenseNet201", "Full evaluation metrics & visualizations"],
    tech: ["Python", "PyTorch", "Jupyter"],
    category: "Deep Learning",
    localReadme: `# Deep Learning Fungal Classification

Image classification project using **PyTorch transfer learning** on the **DeFungi** dataset.

## What it does
- Fine-tunes and compares five pretrained backbones for fungal species recognition:
  **ResNet50, ResNet101, EfficientNet-B0, VGG16 and DenseNet201**.
- Evaluates each model with a full set of classification metrics and visualizations.

## Stack
Python · PyTorch · torchvision · Jupyter Notebook

The full notebook and data pipeline are in the \`Final_Project\` folder of the repository.`,
  },
  {
    repo: "Gatekeeper",
    title: "Gatekeeper",
    tagline:
      "Real-time DDoS detection and automated mitigation: scores every traffic source each second, then rate-limits and blocks flooding sources in nftables while legitimate clients keep working.",
    highlights: ["Attacker rate-limited within 5 s; 0 failed normal requests in demo", "Chaos-tested on Kubernetes: mitigation within 20 s under component failure"],
    tech: ["Python", "Kafka / Redpanda", "Redis", "ONNX", "nftables", "Kubernetes"],
    category: "Security · Systems",
    hideSections: ["More"],
  },
];
