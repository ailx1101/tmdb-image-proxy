# TMDB Image Proxy for Vercel

这是一个为 `image.tmdb.org` 设计的反向代理服务，旨在通过 Vercel 平台提供更稳定、高效的图片加载体验。它支持多种图片尺寸请求、图片格式转换和缓存控制。

## 功能特性

- **反向代理**: 将所有对 `image.tmdb.org` 的请求通过 Vercel 服务器进行转发。
- **图片尺寸支持**: 兼容 TMDB 图片 API 的所有尺寸参数。
- **缓存控制**: 通过 Vercel 的边缘缓存机制，提高图片加载速度并减少源站压力。
- **错误处理**: 完善的错误处理机制，确保服务稳定性。
- **请求频率限制**: 基于 IP 的简单频率限制，防止滥用。
- **HTTPS 支持**: 自动支持 HTTPS 安全连接。

## 项目结构

```
. 
├── api/
│   └── index.js         # Node.js 代理服务代码
├── package.json         # 项目依赖和脚本配置
├── vercel.json          # Vercel 部署配置
└── README.md            # 项目说明和部署文档
```

## 部署到 Vercel

### 步骤 1: 克隆项目

首先，将此项目克隆到您的本地机器：

```bash
git clone <your-repository-url>
cd tmdb-image-proxy
```

### 步骤 2: 安装依赖

进入项目目录并安装必要的 Node.js 依赖：

```bash
npm install
```

### 步骤 3: 配置环境变量

在 Vercel 项目设置中，您需要添加一个环境变量 `TMDB_IMAGE_BASE_URL`，其值为 `https://image.tmdb.org`。

1.  登录到您的 Vercel 账户。
2.  选择或创建一个新项目。
3.  进入项目设置 (Settings) -> 环境变量 (Environment Variables)。
4.  添加一个新的环境变量：
    -   **Name**: `TMDB_IMAGE_BASE_URL`
    -   **Value**: `https://image.tmdb.org`

### 步骤 4: 部署

将项目推送到您的 Git 仓库（GitHub, GitLab, Bitbucket），然后通过 Vercel 仪表板导入该仓库进行部署。Vercel 会自动检测 `vercel.json` 文件并进行相应的配置。

或者，您也可以在项目根目录运行 Vercel CLI 命令进行部署：

```bash
vercel deploy
```

### 步骤 5: 测试

部署成功后，Vercel 会提供一个预览 URL。您可以通过访问类似 `https://your-vercel-app.vercel.app/t/p/w500/poster.jpg` 的 URL 来测试代理服务是否正常工作。

## 自定义域名配置

1.  在 Vercel 项目设置中，导航到“域名 (Domains)”选项卡。
2.  添加您的自定义域名（例如 `images.yourdomain.com`）。
3.  Vercel 会提供 DNS 记录（通常是 A 记录或 CNAME 记录），您需要将这些记录添加到您的域名注册商的 DNS 设置中。
4.  等待 DNS 记录生效，您的自定义域名即可用于访问代理服务。

## 性能优化建议

-   **Vercel 边缘缓存**: `vercel.json` 中已配置 `Cache-Control` 头，利用 Vercel 的 CDN 优势，将图片缓存到离用户最近的边缘节点，显著提高加载速度。
-   **图片尺寸优化**: 始终请求所需尺寸的图片，避免下载过大的图片。
-   **图片格式**: TMDB 支持多种图片格式。在可能的情况下，使用 WebP 或 AVIF 等现代格式，以获得更好的压缩率和质量。
-   **客户端缓存**: 鼓励客户端（浏览器）也对图片进行缓存，减少重复请求。
-   **监控**: 关注 Vercel 的日志和分析，及时发现并解决潜在的性能问题。

## 错误处理

代理服务会捕获上游（TMDB）的错误，并返回相应的 HTTP 状态码。如果代理服务自身发生错误，将返回 500 Internal Server Error。

## 请求频率限制

为了防止滥用，代理服务对每个 IP 地址的请求进行了频率限制（每分钟 100 次请求）。超出限制的请求将返回 429 Too Many Requests 状态码。