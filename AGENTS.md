# 仓库指南

## 项目结构与模块组织

本仓库是前后端分离的管理后台系统，主要分为 `backend` 和 `frontend/console`。

- `backend/src` 是 MidwayJS API 服务：`modules/system` 包含用户、角色、菜单、部门、字典等系统能力；`modules/security` 包含认证和在线用户；`common` 放置通用控制器、服务、实体、DTO 和常量；`config` 管理环境配置和密钥。
- `backend/test` 存放 Jest 控制器测试，`backend/public` 存放后端静态资源。
- `frontend/console/src` 是 Vue 3 管理台：核心目录包括 `views`、`api`、`router`、`store`、`layouts`、`components`、`locales`、`utils` 和 `assets`。
- `frontend/console/cypress` 存放端到端测试，`docs` 存放项目文档，角色定义位于 `docs/roles`。

## 构建、测试与开发命令

请在对应子项目目录下执行命令。

后端：

- `npm run dev`：以 `NODE_ENV=local` 启动本地 MidwayJS 服务。
- `npm test`：以 `NODE_ENV=unittest` 运行 Jest 测试。
- `npm run cov`：运行 Jest 覆盖率统计。
- `npm run lint`：运行 `mwts` 代码风格检查。
- `npm run build`：编译后端产物。

前端：

- `npm run dev`：启动 Vite 开发服务。
- `npm run build`：执行类型检查并构建生产产物。
- `npm run type-check`：运行 `vue-tsc` 类型检查。
- `npm run test:unit`：运行 Vitest 单元测试。
- `npm run test:e2e:dev`：启动 Cypress 端到端测试。
- `npm run lint` / `npm run format`：运行 lint 和格式化工具。

## 编码风格与命名约定

统一使用 TypeScript。新增抽象前先遵循现有目录和命名模式。后端文件遵循 Midway 约定，例如 `*.controller.ts`、`*.service.ts`、`*.entity.ts`、`*.dto.ts` 和 `*.vo.ts`。前端视图使用 PascalCase 或领域目录加 `index.vue`；接口模块放在 `src/api/<domain>`。保持现有别名用法，例如 `@/`。

## 测试规范

后端测试使用 Jest，位于 `backend/test`。前端单元测试使用 Vitest，测试文件采用 `*.spec.ts`；端到端测试使用 Cypress，位于 `frontend/console/cypress/e2e`。涉及认证、RBAC、动态路由，以及用户、角色、菜单、权限 CRUD 的变更应补充测试。

## 需求讨论角色分工

每次讨论需求时，必须先从 `docs/roles` 中分配具体角色，并明确三类责任：

- 负责：实际产出方案、设计、代码、测试或部署材料的角色。
- 主导：推进需求讨论、拆解范围、协调跨角色结论的角色。
- 拍板：对范围、优先级、体验、架构或上线风险做最终决定的角色。

需求结论中应写明类似格式：`主导：产品经理；负责：前端开发、后端开发、测试；拍板：架构师、项目经理`。如果需求涉及安全、数据库、运维、移动端或 CI/CD，必须补充分配对应角色。

## 提交与 Pull Request 规范

当前仓库已有 Git 历史。提交信息统一建议使用 Conventional Commits，例如 `feat: add role permission editor` 或 `fix: handle expired token`。PR 应包含简要说明、影响范围、测试结果、关联 issue；涉及 UI 的变更需附截图。

## 安全与配置提示

不要提交真实密钥、数据库账号、Redis 凭据或生产私钥。谨慎评审 `backend/src/config` 相关变更。后端认证、加密、JWT、Swagger 暴露和 Redis 登录态属于安全敏感路径。
