---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #0f172a
color: #f8fafc
---

# ShipTidy
### Automated, Context-Aware GitHub Pull Request Code Review System

**Lead Presenter:** Divyansh & Engineering Team  
**Domain:** Cloud Architecture, Distributed Systems & AI Engineering  
**Stack:** Next.js 16 (App Router), React 19, Prisma 7, PostgreSQL, Inngest, Pinecone DB, Razorpay  

---

## Slide 2: Project Architecture & Execution Flowchart

```mermaid
flowchart TD
    subgraph GitHub ["GitHub Cloud Platform"]
        PR["Developer Opens/Updates PR"]
        Comment["Octokit Posts Review Comment"]
    end

    subgraph Webhook_Layer ["ShipTidy Ingestion"]
        HookAPI["POST /api/github/webhook"]
        Verify["HMAC SHA-256 Signature Verification"]
        PrismaUpsert["Prisma: Upsert PullRequest (status: 'pending')"]
    end

    subgraph Orchestration ["Inngest Background Worker"]
        Event["Inngest Event: 'github/pr.review'"]
        FetchDiff["Octokit: Fetch PR Diff & Changed Files"]
        VectorQuery["Pinecone: Semantic Vector Search"]
        AIReview["Vercel AI SDK: Generate Markdown Code Review"]
    end

    subgraph Storage_UI ["Storage & Notification"]
        SaveReview["Prisma: Save reviewComment (status: 'reviewed')"]
        Dash["ShipTidy Dashboard (Real-time Feed)"]
    end

    PR --> HookAPI
    HookAPI --> Verify
    Verify --> PrismaUpsert
    PrismaUpsert --> Event
    Event --> FetchDiff
    FetchDiff --> VectorQuery
    VectorQuery --> AIReview
    AIReview --> Comment
    AIReview --> SaveReview
    SaveReview --> Dash
```

- **Resilience:** Background jobs in Inngest prevent serverless HTTP timeout penalties.
- **RAG Context:** Pinecone vector search injects existing code patterns into review prompts.

---

## Slide 3: Entity Relationship (ER) Diagram & Relations

```mermaid
erDiagram
    User ||--o{ Session : "has many (Cascade)"
    User ||--o{ Account : "has many (Cascade)"
    User ||--o| GithubInstallation : "has one (Cascade)"
    GithubInstallation ||--o{ PullRequest : "manages by installationId"
    GithubInstallation ||--o{ RepoSync : "syncs by installationId"

    User {
        string id PK
        string name
        string email UK
        string plan "free | pro"
        string razorpaySubscriptionId
        string subscriptionStatus
        datetime subscriptionRenewsAt
    }

    Session {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
        string ipAddress
        string userAgent
    }

    Account {
        string id PK
        string userId FK
        string providerId
        string accountId
        string accessToken
        string refreshToken
    }

    GithubInstallation {
        string id PK
        string userId FK,UK
        int installationId
        string accountLogin
        string accountType
    }

    PullRequest {
        string id PK
        int installationId
        string repoFullName
        int prNumber
        string title
        string headSha
        string baseBranch
        string status "pending | reviewed | rate_limited"
        string reviewComment
        datetime reviewedAt
    }

    RepoSync {
        string id PK
        int installationId
        string repoFullName UK
        string branch
        string status "pending | syncing | synced | failed"
        int chunkCount
        datetime syncedAt
    }
```

---

## Slide 4: Database Schema Mappings & Core Production Queries

### 1. Database Schema Breakdown (7 Tables)
| Table | Model | Primary Key | Key Indexes & Constraints | Functional Role |
| :--- | :--- | :--- | :--- | :--- |
| `user` | `User` | `id` (String) | `@@unique([email])` | User identity & Razorpay subscription tier |
| `session` | `Session` | `id` (String) | `@@unique([token])`, `@@index([userId])` | Active sessions with cascade delete |
| `account` | `Account` | `id` (String) | `@@index([userId])` | OAuth tokens (GitHub Provider) |
| `github_installation`| `GithubInstallation` | `id` (cuid) | `@@unique([userId])` | GitHub App tenant installation ID |
| `pull_request` | `PullRequest` | `id` (cuid) | `@@unique([repoFullName, prNumber])` | PR reviews, status, and AI markdown |
| `repo_sync` | `RepoSync` | `id` (cuid) | `@@unique([repoFullName])` | Pinecone vector embedding synchronization |
| `verification` | `Verification`| `id` (String) | `@@index([identifier])` | Token verification records |

---

### Slide 4 (Continued): Core Production Queries

#### Query 1: Atomic Webhook PR Upsert
```typescript
await prisma.pullRequest.upsert({
  where: { repoFullName_prNumber: { repoFullName, prNumber } },
  create: {
    installationId, repoFullName, prNumber,
    title, headSha, baseBranch, status: "pending"
  },
  update: { title, headSha, status: "pending" }
});
```

#### Query 2: Review Usage Meter (Monthly Free Tier Limit)
```typescript
const reviewsUsed = await prisma.pullRequest.count({
  where: {
    installationId,
    status: "reviewed",
    reviewedAt: { gte: startOfMonth }
  }
});
```

#### Query 3: Dashboard Chronological Activity Feed
```typescript
await prisma.pullRequest.findMany({
  where: { installationId, status: { in: ["reviewed", "rate_limited"] } },
  orderBy: { updatedAt: "desc" },
  take: 10,
  select: { id: true, repoFullName: true, prNumber: true, status: true, reviewedAt: true }
});
```

---

## Slide 5: Frontend Views & Architecture Walkthrough

1. **Landing & Marketing View (`app/page.tsx`)**:
   - Hero section with live interactive code diff animation.
   - Core value proposition, feature grid, and transparent Razorpay pricing tiers.

2. **Authentication Flow (`app/(auth)/sign-in`)**:
   - One-click GitHub OAuth via Better Auth with automated GitHub App installation prompt.

3. **Dashboard Overview Hub (`app/(protected)/dashboard/overview`)**:
   - Real-time GitHub App connectivity badge.
   - Monthly review usage progress meter (`used / limit`).
   - Repository health metrics and live review audit feed.

4. **Repository Manager & Vector Sync (`app/(protected)/dashboard/repos`)**:
   - Lists connected GitHub repositories.
   - One-click codebase embedding trigger into Pinecone vector index.

5. **Pull Request Review Inspector (`app/(protected)/dashboard/pull-request/[id]`)**:
   - Detailed Markdown rendering with syntax highlighting and suggested code changes.

6. **Settings & Billing (`app/(protected)/dashboard/settings`)**:
   - Self-service plan upgrading via Razorpay checkout with instant webhook synchronization.

---

## Slide 6: Engineering Highlights & System Impact

- **Decoupled Architecture**: Webhook ingestion returns `200 OK` in <50ms; heavy AI diff synthesis is delegated to Inngest background workers.
- **Precision RAG**: Pinecone vector embeddings ground LLM reviews in real codebase context, dramatically cutting false positive comments.
- **Enterprise Security**: Webhook SHA-256 HMAC verification, scoped queries by `installationId`, and encrypted token persistence.
- **Multi-Tenant Ready**: Scalable across thousands of repositories with independent usage tracking and automated Razorpay subscription management.
