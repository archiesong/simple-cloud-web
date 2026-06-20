# 项目待办清单

本文档用于跟踪 simple-cloud-web 项目启动阶段和阶段总结后的未完成事项。2026-06-20 阶段总结会已将第一阶段目标确定为“上线准备优先”：先处理安全、配置、构建和质量门禁问题，再推进 MVP 演示。

## P0：启动阶段必须确认

- [x] 确认第一阶段目标：上线准备优先，先补齐安全、测试、部署和文档，再组织 MVP 演示范围。负责人：项目经理；拍板：项目经理、架构师。
- [ ] 确认第一阶段时间窗口、里程碑和交付范围。负责人：项目经理；拍板：项目经理。
- [x] 确认 Git 仓库状态：当前仓库已有提交历史，最近提交包括 `chore: initialize repository` 和 `Merge remote-tracking branch 'origin/main'`。负责人：技术负责人、DevOps/CI 工程师；拍板：架构师。
- [ ] 确认分支策略、提交规范和 PR 规范。建议使用 Conventional Commits。负责人：技术负责人、DevOps/CI 工程师；拍板：架构师。
- [ ] 梳理第一版需求范围和验收标准。负责人：产品经理；拍板：项目经理。
- [ ] 明确 RBAC 权限模型，包括用户、角色、菜单、按钮权限、数据范围和动态路由规则。负责人：架构师、产品经理、后端开发、前端开发；拍板：架构师。

## 2026-06-20 代码审查待办

审查说明：当前目录 `/Users/songchao/Desktop/simple-cloud-web` 已是 Git 仓库。以下事项基于当前工作区源码审查；当前仍有未提交变更，主要集中在后端生产配置、JWT 中间件、前端权限路由恢复、请求封装、Docker 配置和相关测试。

### P0：安全阻断

- [x] 移除前端源码中的静态 RSA 私钥。当前 `frontend/console/src/utils/crypto.ts` 不再包含项目私钥常量。负责人：前端开发、安全工程师；拍板：架构师。
- [ ] 清理并重新生成前端构建产物，确认 `frontend/console/dist` 不包含项目私钥。2026-06-20 已重新执行 `npm run build-only`，当前产物仍包含 `jsencrypt` 的 `getPrivateKey` 模板字符串，需要安全工程师确认该依赖模板不等同于真实密钥泄露。负责人：前端开发、安全工程师；拍板：架构师。
- [ ] 轮换已暴露的 RSA 密钥对，重新生成后端 `public.pem/private.pem`，并清理历史构建产物中的泄露内容。负责人：安全工程师、后端开发、运维；拍板：架构师。
- [ ] 防止后端 Docker 镜像打包 RSA 私钥。当前 `backend/src/config/config.prod.ts` 默认读取 `./keys/private.pem`，`backend/Dockerfile` 会复制整个 `dist` 到运行镜像，本地构建后已确认 `backend/dist/config/keys/private.pem` 存在。需改为运行时 Docker secret、volume 或环境注入，并在 `.dockerignore`/构建流程中排除 `src/config/keys` 和 `dist/config/keys`。负责人：后端开发、DevOps/CI 工程师、安全工程师；拍板：架构师。

### P1：安全与配置

- [ ] 将后端 cookie `keys`、MySQL 账号密码、AES key/iv、RSA 私钥路径等敏感配置迁移到环境变量或密钥管理系统。当前 `config.prod.ts` 已开始接入环境变量，仍需完成安全审查和运行验证。负责人：后端开发、安全工程师、运维；拍板：架构师。
- [ ] 收紧 `backend/src/config/keys/private.pem` 文件权限，并避免源码树保存生产私钥。负责人：安全工程师、运维；拍板：架构师。
- [x] 补充根目录 `.gitignore`，覆盖 `dist/`、`node_modules/`、`logs/`、`.DS_Store`、本地密钥和本地配置文件，避免误提交生成物和敏感文件。负责人：DevOps/CI 工程师、技术负责人；拍板：架构师。
- [ ] 完善生产环境配置。`backend/src/config/config.prod.ts` 已开始补充 datasource、Redis、JWT、RSA、AES、CORS 和全局前缀配置，仍需联调和部署验证。负责人：后端开发、运维；拍板：架构师。
- [ ] 审查 `backend/docker-compose.yml` 中示例密钥和数据库密码，确保仅用于本地演示。当前 compose 文件包含 `COOKIE_KEYS`、`JWT_REFRESH_SECRET`、`AES_KEY`、`AES_IV`、MySQL root/user 密码和健康检查明文密码；生产环境需改为 `.env.example` + `${VAR:?required}`、Docker secret 或密钥管理系统注入。负责人：DevOps/CI 工程师、安全工程师、运维；拍板：架构师。

### P1：后端接口与认证

- [ ] 实现或移除角色新增、更新、删除接口。前端调用 `/api/roles/create`、`/api/roles/update`、`/api/roles/delete`，后端 `RoleController` 当前只实现 `/list` 和 `/detail`。负责人：后端开发、前端开发；拍板：架构师。
- [ ] 实现用户新增、更新、删除接口并返回统一响应。当前 `UserController` 暴露接口但未调用服务层，`UserServiceImpl.create/delete/update` 仅 `console.log`。负责人：后端开发；拍板：架构师。
- [ ] 完善退出登录逻辑：退出时删除在线缓存或服务端 token 状态，并评估 `/api/auth/logout` 是否应继续放在 JWT 白名单。当前退出后 token 仍可用到过期。负责人：后端开发、安全工程师；拍板：架构师。
- [ ] 验证 JWT 白名单在 Vite 代理去掉 `/api` 前缀后仍能正确放行登录、验证码、公钥和退出接口。当前 `jwt.middleware.ts` 已开始兼容 `koa.globalPrefix`，并新增单元测试，仍需完整回归。负责人：后端开发、测试。

### P2：接口契约与错误处理

- [ ] 修正角色详情请求参数。`frontend/console/src/views/system/role/modules/OperationModal/index.vue` 当前向 `getRoleDetail` 传数字 id，应传 `{ id }`。负责人：前端开发。
- [ ] 验证前端请求封装不会重复拼接 `/api`，且加密请求签名使用真实请求路径。当前 `frontend/console/src/utils/request/index.ts` 已开始修正，并新增 Vitest 覆盖。负责人：前端开发、测试。
- [ ] 调整加密响应失败策略。`backend/src/middleware/crypto.middleware.ts` 当前在响应加密失败时返回明文，应改为失败响应或明确降级白名单。负责人：后端开发、安全工程师；拍板：架构师。
- [ ] 错误过滤器设置正确 HTTP status。`DefaultErrorFilter` 和 `NotFoundFilter` 当前只返回 body，未设置 `ctx.status`，网关和客户端可能按 HTTP 200 处理错误。负责人：后端开发、测试。

### P2：构建与质量

- [ ] 修复前端 `npm run type-check` 失败问题，包括缺失依赖或类型声明、`tsconfig.vitest.json` include 范围、全局自动导入类型、`Recordable/Indexable` 类型可见性、组件库类型不匹配等。负责人：前端开发、DevOps/CI 工程师。
- [ ] 修复新增前端测试带来的类型门禁问题。当前新增测试可通过 Vitest，但 `npm run type-check` 中仍出现 `tsconfig.vitest.json` include 范围不足，以及 `frontend/console/src/utils/__tests__/business-routes.spec.ts` 中 `systemRoute` 可能为 `undefined` 等错误。负责人：前端开发、测试。
- [ ] 将前端构建门禁明确为 `npm run build`，而不是只跑 `npm run build-only`。当前 `build-only` 可通过，但 `npm run build` 会先执行失败的 `type-check`。负责人：前端开发、DevOps/CI 工程师；拍板：技术负责人。
- [ ] 为认证、退出登录、角色 CRUD、用户 CRUD、错误过滤器和加密响应失败补充后端 Jest 或前端 Vitest/Cypress 覆盖。当前已新增 JWT 白名单、前端请求封装和动态路由恢复相关测试，核心 CRUD 与错误过滤器仍待覆盖。负责人：后端开发、前端开发、测试。

### P3：清理项

- [x] 删除前端动态路由生成流程中的调试输出。负责人：前端开发。

### 本次审查验证记录

- 后端 `npm test -- --runInBand`：通过，6 个测试套件、9 个测试。
- 后端 `npm run build`：通过。
- 前端 `npm run test:unit -- --run`：通过，8 个测试文件、12 个测试；存在 `Notice` 组件命名冲突提示。
- 前端 `npm run build-only`：通过；仍有 chunk size 和 Rolldown pure annotation 警告。
- 前端 `npm run type-check`：失败。主要错误类别包括缺失 Vite 插件或类型声明、`tsconfig.vitest.json` include 范围不足、全局自动导入类型不可见、`Recordable/Indexable` 类型不可见、组件库和图表配置类型不匹配。
- `docker compose config`：通过，但不验证镜像内私钥泄露问题。

## P1：需求与设计

- [ ] 输出 PRD 或需求说明，覆盖登录、用户、角色、菜单、部门、字典和权限配置。负责人：产品经理。
- [ ] 输出页面原型或交互说明，覆盖表格、表单、弹窗、权限树、空状态和错误状态。负责人：UI 设计工程师、产品经理。
- [ ] 明确中英文文案、错误提示和菜单命名规则。负责人：产品经理、UI 设计工程师、前端开发。
- [ ] 确认用户、角色、菜单、部门、字典等核心模块的删除约束和关联保护规则。负责人：产品经理、后端开发、数据库工程师。

## P1：架构与接口

- [ ] 输出接口契约，统一请求参数、响应结构、分页结构、错误码和权限标识。负责人：后端开发、前端开发；拍板：架构师。
- [ ] 确认动态菜单接口结构、前端组件映射规则和路由生成规则。负责人：前端开发、后端开发；拍板：架构师。
- [ ] 确认登录链路：验证码、公钥获取、密码加密、Token 生成、用户信息、动态菜单、退出登录。负责人：后端开发、前端开发、安全工程师。
- [ ] 确认后端接口权限校验策略，避免只依赖前端菜单隐藏。负责人：后端开发、安全工程师；拍板：架构师。

## P1：数据与初始化

- [ ] 确认数据库初始化数据，包括管理员账号、默认角色、基础菜单和权限标识。负责人：数据库工程师、后端开发。
- [ ] 确认用户、角色、菜单、部门等实体关系、索引策略和事务边界。负责人：数据库工程师、后端开发；拍板：架构师。
- [ ] 输出数据库迁移、初始化和回滚说明。负责人：数据库工程师、后端开发、运维。

## P1：安全与配置

- [ ] 审查密钥、数据库账号、Redis 凭据、JWT 配置和加密密钥管理方式。负责人：安全工程师、运维。
- [ ] 确认 Swagger 在不同环境的暴露策略。负责人：安全工程师、后端开发、运维；拍板：架构师。
- [ ] 明确敏感信息日志脱敏规则。负责人：安全工程师、后端开发、运维。
- [ ] 制定越权访问、Token 过期、退出登录、弱密码和异常登录测试清单。负责人：安全工程师、测试。

## P2：测试与质量

- [ ] 补齐后端 Jest 测试，优先覆盖认证、用户、角色、菜单和权限接口。负责人：后端开发、测试。
- [ ] 补齐前端 Vitest 测试，优先覆盖请求封装、路由守卫、状态管理和核心组件。负责人：前端开发、测试。
- [ ] 将 Cypress 示例测试替换为真实端到端用例，覆盖登录、权限、用户、角色、菜单核心流程。负责人：测试、前端开发。
- [ ] 确认质量门禁命令：后端 `npm test`、`npm run lint`、`npm run build`；前端 `npm run type-check`、`npm run test:unit`、`npm run lint`、`npm run build`。负责人：技术负责人、DevOps/CI 工程师。

## P2：环境与发布

- [ ] 明确前后端 Node.js 版本差异和本地开发环境要求。负责人：DevOps/CI 工程师、技术负责人。
- [ ] 准备 MySQL、Redis、后端服务、前端静态资源和 API 代理的测试环境。负责人：运维、DevOps/CI 工程师。
- [ ] 设计 CI/CD 流水线，覆盖依赖安装、缓存、Lint、测试、构建和制品管理。负责人：DevOps/CI 工程师。
- [ ] 输出部署、回滚、日志、监控和备份恢复说明。负责人：运维、DevOps/CI 工程师。

## 关联文档

- [项目启动会纪要](projects/2026-06-20-project-kickoff-minutes.md)
- [阶段总结会纪要](projects/2026-06-20-phase-summary-minutes.md)
