-- simple-cloud-web RBAC baseline schema and seed data.
-- Target: MySQL 8.x, TypeORM synchronize=false.

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS `simple-admin` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `simple-admin`;

CREATE TABLE IF NOT EXISTS `sys_dept` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `create_by` varchar(255) NULL COMMENT '创建人',
  `update_by` varchar(255) NULL COMMENT '更新人',
  `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间 yyyy-MM-dd HH:mm:ss',
  `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间 yyyy-MM-dd HH:mm:ss',
  `name` varchar(255) NOT NULL COMMENT '部门名称',
  `enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `pid` bigint NULL COMMENT '上级部门',
  `sort` int NULL COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `idx_sys_dept_enabled` (`enabled`),
  KEY `idx_sys_dept_pid` (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';

CREATE TABLE IF NOT EXISTS `sys_job` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `create_by` varchar(255) NULL COMMENT '创建人',
  `update_by` varchar(255) NULL COMMENT '更新人',
  `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间 yyyy-MM-dd HH:mm:ss',
  `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间 yyyy-MM-dd HH:mm:ss',
  `name` varchar(180) NOT NULL COMMENT '名称',
  `sort` int NULL COMMENT '排序',
  `enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_job_name` (`name`),
  KEY `idx_sys_job_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='岗位表';

CREATE TABLE IF NOT EXISTS `sys_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `create_by` varchar(255) NULL COMMENT '创建人',
  `update_by` varchar(255) NULL COMMENT '更新人',
  `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间 yyyy-MM-dd HH:mm:ss',
  `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间 yyyy-MM-dd HH:mm:ss',
  `name` varchar(100) NOT NULL COMMENT '名称',
  `dataScope` tinyint NOT NULL DEFAULT 1 COMMENT '数据权限：全部、本级、自定义',
  `enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT '角色是否启用',
  `code` varchar(255) NULL COMMENT '角色标识',
  `level` int NOT NULL DEFAULT 3 COMMENT '级别，数值越小，级别越大',
  `description` varchar(255) NULL COMMENT '描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_role_name` (`name`),
  KEY `idx_sys_role_enabled` (`enabled`),
  KEY `idx_sys_role_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

CREATE TABLE IF NOT EXISTS `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `create_by` varchar(255) NULL COMMENT '创建人',
  `update_by` varchar(255) NULL COMMENT '更新人',
  `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间 yyyy-MM-dd HH:mm:ss',
  `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间 yyyy-MM-dd HH:mm:ss',
  `username` varchar(180) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `nick` varchar(255) NULL COMMENT '昵称',
  `email` varchar(180) NOT NULL COMMENT '邮箱',
  `phone` varchar(255) NULL COMMENT '手机号',
  `gender` tinyint NOT NULL DEFAULT 1 COMMENT '性别',
  `avatar` varchar(255) NULL COMMENT '头像',
  `dept_id` bigint NULL COMMENT '部门ID',
  `enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT '账号是否启用',
  `is_delete` tinyint(1) NULL DEFAULT 0 COMMENT '账号是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_user_username` (`username`),
  UNIQUE KEY `uk_sys_user_email` (`email`),
  KEY `idx_sys_user_nick` (`nick`),
  KEY `idx_sys_user_phone` (`phone`),
  KEY `idx_sys_user_dept_id` (`dept_id`),
  KEY `idx_sys_user_enabled` (`enabled`),
  KEY `idx_sys_user_is_delete` (`is_delete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE IF NOT EXISTS `sys_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `create_by` varchar(255) NULL COMMENT '创建人',
  `update_by` varchar(255) NULL COMMENT '更新人',
  `create_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间 yyyy-MM-dd HH:mm:ss',
  `update_time` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间 yyyy-MM-dd HH:mm:ss',
  `title` varchar(100) NOT NULL COMMENT '菜单标题',
  `name` varchar(100) NULL COMMENT '菜单组件名称',
  `sort` int NOT NULL DEFAULT 999 COMMENT '排序',
  `component` varchar(255) NULL COMMENT '组件路径',
  `path` varchar(255) NULL COMMENT '路由地址',
  `redirect` varchar(255) NULL COMMENT '重定向地址',
  `type` tinyint NOT NULL DEFAULT 1 COMMENT '菜单类型：目录、菜单、按钮',
  `permission` varchar(255) NULL COMMENT '权限标识',
  `icon` varchar(255) NULL COMMENT '菜单图标',
  `cache` tinyint(1) NULL COMMENT '缓存',
  `hidden` tinyint(1) NULL COMMENT '是否隐藏',
  `pid` bigint NULL COMMENT '上级菜单',
  `enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT '菜单是否启用',
  `breadcrumb` tinyint(1) NOT NULL DEFAULT 1 COMMENT '面包屑是否可见',
  `hideChildrenInMenu` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否隐藏子菜单',
  `affix` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否固定标签页',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_menu_title` (`title`),
  UNIQUE KEY `uk_sys_menu_name` (`name`),
  KEY `idx_sys_menu_pid` (`pid`),
  KEY `idx_sys_menu_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

CREATE TABLE IF NOT EXISTS `sys_users_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `idx_sys_users_roles_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

CREATE TABLE IF NOT EXISTS `sys_users_jobs` (
  `user_id` bigint NOT NULL,
  `job_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`, `job_id`),
  KEY `idx_sys_users_jobs_job_id` (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户岗位关联表';

CREATE TABLE IF NOT EXISTS `sys_roles_menus` (
  `role_id` bigint NOT NULL,
  `menu_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`, `menu_id`),
  KEY `idx_sys_roles_menus_menu_id` (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

CREATE TABLE IF NOT EXISTS `sys_roles_depts` (
  `role_id` bigint NOT NULL,
  `dept_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`, `dept_id`),
  KEY `idx_sys_roles_depts_dept_id` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色部门关联表';

INSERT INTO `sys_dept` (`id`, `create_by`, `update_by`, `name`, `enabled`, `pid`, `sort`)
VALUES (1, 'system', 'system', '总部', 1, NULL, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `enabled` = VALUES(`enabled`);

INSERT INTO `sys_job` (`id`, `create_by`, `update_by`, `name`, `sort`, `enabled`)
VALUES (1, 'system', 'system', '管理员', 1, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `enabled` = VALUES(`enabled`);

INSERT INTO `sys_role` (`id`, `create_by`, `update_by`, `name`, `dataScope`, `enabled`, `code`, `level`, `description`)
VALUES (1, 'system', 'system', '超级管理员', 0, 1, 'admin', 1, '系统内置超级管理员')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `code` = VALUES(`code`), `dataScope` = VALUES(`dataScope`), `enabled` = VALUES(`enabled`), `level` = VALUES(`level`), `description` = VALUES(`description`);

INSERT INTO `sys_user` (`id`, `create_by`, `update_by`, `username`, `password`, `nick`, `email`, `phone`, `gender`, `avatar`, `dept_id`, `enabled`, `is_delete`)
VALUES (1, 'system', 'system', 'admin', '$argon2id$v=19$m=4096,t=3,p=1$ctlh99ahasib0YkLr3mbIA$BU3d8eQEIr1gjqf/Mi6MbBtUZhHQPKz1lqvnWLSp5wA', '管理员', 'admin@example.com', '13800000000', 1, '', 1, 1, 0)
ON DUPLICATE KEY UPDATE `nick` = VALUES(`nick`), `password` = VALUES(`password`), `enabled` = VALUES(`enabled`);

INSERT INTO `sys_menu` (`id`, `create_by`, `update_by`, `title`, `name`, `sort`, `component`, `path`, `redirect`, `type`, `permission`, `icon`, `cache`, `hidden`, `pid`, `enabled`, `breadcrumb`, `hideChildrenInMenu`, `affix`)
VALUES
(10, 'system', 'system', '仪表盘', 'Dashboard', 0, 'Dashboard', 'dashboard', NULL, 1, 'dashboard', 'ri:dashboard-line', 1, 0, 0, 1, 1, 0, 1),
(1, 'system', 'system', '系统管理', 'System', 10, 'PageView', '/system', '/system/user', 0, 'system', 'ri:settings-3-line', 1, 0, 0, 1, 1, 0, 0),
(2, 'system', 'system', '用户管理', 'User', 20, 'User', 'user', NULL, 1, 'system:user:list', 'ri:user-3-line', 1, 0, 1, 1, 1, 0, 0),
(3, 'system', 'system', '角色管理', 'Role', 30, 'Role', 'role', NULL, 1, 'system:role:list', 'ri:shield-user-line', 1, 0, 1, 1, 1, 0, 0),
(4, 'system', 'system', '菜单管理', 'Menu', 40, 'Menu', 'menu', NULL, 1, 'system:menu:list', 'ri:menu-2-line', 1, 0, 1, 1, 1, 0, 0),
(5, 'system', 'system', '角色权限配置', NULL, 204, NULL, NULL, NULL, 2, 'system:role:assign', NULL, 0, 1, 3, 1, 1, 0, 0),
(101, 'system', 'system', '新增用户', NULL, 101, NULL, NULL, NULL, 2, 'system:user:create', NULL, 0, 1, 2, 1, 1, 0, 0),
(102, 'system', 'system', '修改用户', NULL, 102, NULL, NULL, NULL, 2, 'system:user:update', NULL, 0, 1, 2, 1, 1, 0, 0),
(103, 'system', 'system', '删除用户', NULL, 103, NULL, NULL, NULL, 2, 'system:user:delete', NULL, 0, 1, 2, 1, 1, 0, 0),
(201, 'system', 'system', '新增角色', NULL, 201, NULL, NULL, NULL, 2, 'system:role:create', NULL, 0, 1, 3, 1, 1, 0, 0),
(202, 'system', 'system', '修改角色', NULL, 202, NULL, NULL, NULL, 2, 'system:role:update', NULL, 0, 1, 3, 1, 1, 0, 0),
(203, 'system', 'system', '删除角色', NULL, 203, NULL, NULL, NULL, 2, 'system:role:delete', NULL, 0, 1, 3, 1, 1, 0, 0),
(301, 'system', 'system', '新增菜单', NULL, 301, NULL, NULL, NULL, 2, 'system:menu:create', NULL, 0, 1, 4, 1, 1, 0, 0),
(302, 'system', 'system', '修改菜单', NULL, 302, NULL, NULL, NULL, 2, 'system:menu:update', NULL, 0, 1, 4, 1, 1, 0, 0),
(303, 'system', 'system', '删除菜单', NULL, 303, NULL, NULL, NULL, 2, 'system:menu:delete', NULL, 0, 1, 4, 1, 1, 0, 0)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `name` = VALUES(`name`), `sort` = VALUES(`sort`), `component` = VALUES(`component`), `path` = VALUES(`path`), `redirect` = VALUES(`redirect`), `type` = VALUES(`type`), `permission` = VALUES(`permission`), `icon` = VALUES(`icon`), `cache` = VALUES(`cache`), `hidden` = VALUES(`hidden`), `pid` = VALUES(`pid`), `enabled` = VALUES(`enabled`), `breadcrumb` = VALUES(`breadcrumb`), `hideChildrenInMenu` = VALUES(`hideChildrenInMenu`), `affix` = VALUES(`affix`);

INSERT IGNORE INTO `sys_users_roles` (`user_id`, `role_id`) VALUES (1, 1);
INSERT IGNORE INTO `sys_users_jobs` (`user_id`, `job_id`) VALUES (1, 1);
INSERT IGNORE INTO `sys_roles_depts` (`role_id`, `dept_id`) VALUES (1, 1);
INSERT IGNORE INTO `sys_roles_menus` (`role_id`, `menu_id`)
SELECT 1, `id` FROM `sys_menu`;
