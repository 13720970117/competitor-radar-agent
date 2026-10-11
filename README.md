# 竞品雷达 Agent Demo

一个用于快速验证竞品分析想法的轻量级 AI Agent MVP。用户输入 3 个竞品及背景资料，系统从定位、功能、体验、商业模式、数据表现等维度生成结构化对比和产品建议。

## 在线体验

<https://competitor-radar-agent.netlify.app/>

备用地址：<https://competitor-radar-agent.13720970117-b7e.workers.dev/>

## 技术实现

- React 19 + TypeScript
- Vite / Vinext
- Cloudflare Workers
- 火山方舟豆包 Responses API
- 服务端 Prompt 编排与结构化 JSON 校验

这是单轮 LLM 工作流型 Agent MVP，目前不包含联网搜索、模型自主工具调用、RAG、长期记忆或多 Agent 协作。

## 本地运行

要求 Node.js `>=22.13.0`。

```bash
npm install
export AI_API_BASE="https://ark.cn-beijing.volces.com/api/v3"
export AI_MODEL="你的模型或推理接入点 ID"
export AI_API_KEY="你的 API Key"
npm run dev
```

API Key 只放在本地环境变量或托管平台 Secret 中，不要提交到 Git 仓库。

## 主要文件

- `app/page.tsx`：前端输入与报告展示
- `app/api/analyze/route.ts`：参数校验、Prompt、模型调用与结果归一化
- `app/globals.css`：页面样式
- `vite.config.ts`：构建和 Cloudflare 运行配置
- `.openai/hosting.json`：Sites 托管配置

## 验证

```bash
npm run build
npx oxlint app vite.config.ts
```

## 部署到 Cloudflare Workers

```bash
npx wrangler login
npx wrangler secret put AI_API_KEY --name competitor-radar-agent
npm run deploy:cloudflare
```

模型地址、模型 ID 和超时时间在 `wrangler.jsonc` 中维护，API Key 只存放在 Cloudflare Secret 中。

## 部署到 Netlify

```bash
npx netlify-cli login
npx netlify-cli deploy --prod
```

Netlify 使用 `netlify.toml` 和 Next.js 构建，`AI_API_KEY` 必须保存为托管平台环境变量。
