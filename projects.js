/*
 * Projects shown on the site.
 * To add a project (e.g. Gatekeeper), copy one object and change the fields.
 *   repo       – exact GitHub repo name under GITHUB_USER (used for the README + GitHub link)
 *   readmePath – optional: path to the README if it isn't at the repo root
 *   localReadme – optional: markdown shown instead of fetching from GitHub
 *   status     – optional: "In progress" etc. (shows a badge)
 */
const GITHUB_USER = "adarshmohan29";

const PROJECTS = [
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
  // {
  //   repo: "Gatekeeper",
  //   title: "Gatekeeper",
  //   tagline: "…",
  //   highlights: [],
  //   tech: [],
  //   category: "…",
  //   status: "In progress",
  // },
];
