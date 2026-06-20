# simple-cloud-web 阶段总结会纪要

## 会议信息

- 会议主题：simple-cloud-web 第一阶段总结与下一阶段计划确认
- 会议日期：2026-06-20
- 会议目标：确认第一阶段目标口径，更新过时文档，收敛安全、配置、构建和质量门禁风险。

## 角色分工

主导：项目经理

负责：产品经理、前端开发、后端开发、测试、数据库工程师、安全工程师、DevOps/CI 工程师、运维、文档工程师

拍板：架构师、项目经理

## 阶段结论

第一阶段按“上线准备优先”推进。当前不再以单纯本地跑通或需求架构梳理作为唯一目标，而是先处理已识别的安全、配置、构建和测试问题，再组织 MVP 演示范围。

优先级如下：

1. 安全与配置：处理 RSA 私钥暴露风险、生产配置环境变量、密钥管理、Swagger 暴露和敏感日志。
2. 认证与请求链路：验证 JWT 白名单、Vite 代理路径、前端请求前缀、加密请求签名和退出登录状态。
3. 构建与质量：保留 `npm run build` 作为前端门禁目标，继续修复 `type-check` 失败；后端继续保持 Jest 和 build 通过。
4. 业务闭环：补齐用户、角色、菜单、权限相关 CRUD、接口契约、RBAC 模型和回归测试。

## 当前事实

- 仓库已有 Git 历史，最近提交包括 `chore: initialize repository` 和 `Merge remote-tracking branch 'origin/main'`。
- 当前工作区存在未提交变更，主要涉及后端生产配置、JWT 中间件、前端权限路由恢复、请求封装、Docker 配置和相关测试。
- 根目录 `.gitignore` 已覆盖构建产物、依赖、日志、本地环境和密钥文件。
- 前端源码 `frontend/console/src/utils/crypto.ts` 不再包含项目 RSA 私钥常量。
- 前端构建产物仍可搜到 `jsencrypt` 的 `getPrivateKey` 模板字符串，需要安全工程师确认其是否属于依赖库正常模板，而非真实密钥泄露。

## 验证结果

- 后端 `npm test -- --runInBand`：通过，4 个测试套件、5 个测试。
- 后端 `npm run build`：通过。
- 前端 `npm run test:unit -- --run`：通过，5 个测试文件、7 个测试；存在 `Notice` 组件命名冲突提示。
- 前端 `npm run build-only`：通过；仍有 chunk size 和 Rolldown pure annotation 警告。
- 前端 `npm run type-check`：失败。主要问题集中在缺失插件或类型声明、`tsconfig.vitest.json` include 范围不足、全局自动导入类型、`Recordable/Indexable` 类型和组件库类型不匹配。

## 行动项

- 项目经理：确认第一阶段时间窗口、里程碑和验收标准。
- 架构师：拍板 RBAC、认证授权、动态菜单、接口契约和上线风险优先级。
- 安全工程师：确认构建产物中的 `jsencrypt` 私钥模板是否构成泄露，推动已暴露密钥轮换。
- 后端开发：完成生产配置、JWT 白名单、退出登录和接口权限校验回归。
- 前端开发：修复请求路径、动态路由恢复、角色详情参数和 `type-check` 失败。
- 测试：补齐登录、权限、用户、角色、菜单和错误过滤器回归用例。
- DevOps/CI 工程师、运维：确认 Docker、环境变量、密钥注入、发布和回滚方案。
- 文档工程师：持续同步 `docs/TODOs.md`、会议纪要、部署说明和验收记录。
