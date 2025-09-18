module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2, // 2 表示必须遵守
      "always",
      [
        // 默认类型
        "build", // 构建系统或外部依赖的更改（如 webpack、gulp 配置变更或 npm 依赖更新）
        "chore", // 构建过程或辅助工具的变动（非代码或测试的杂项维护）
        "ci", // 持续集成配置的更改（如 Travis、GitLab CI 的配置调整）
        "docs", // 文档相关的更新（如修改 README 或注释）
        "feat", // 新增功能（feature）
        "fix", // 修复 bug
        "perf", // 性能优化（提升代码性能的变更）
        "refactor", // 代码重构（非新增功能也非修复 bug 的结构调整）
        "revert", // 撤销之前的提交（如 git revert）
        "style", // 代码格式调整（如空格、缩进等，不影响逻辑运行）
        "test", // 测试相关的更改（新增或修改测试用例）
        // 添加你的自定义类型 👇
        "update", // 小型更新
      ],
    ],
  },
};
