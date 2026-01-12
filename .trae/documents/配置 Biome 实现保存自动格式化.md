根据您的项目配置（已存在 `biome.json`），最佳方案是使用 **Biome** 来处理代码格式化。Biome 是一个高性能的 Web 工具链，能够极快地格式化和检查代码，且您项目中已经配置好了它。

为了实现“点击保存自动格式化”，我将执行以下操作：

1.  **配置编辑器设置** (`.vscode/settings.json`)：
    *   启用 `editor.formatOnSave`（保存时格式化）。
    *   设置 `editor.defaultFormatter` 为 `biomejs.biome`（指定 Biome 为默认格式化器）。
    *   配置 `editor.codeActionsOnSave` 以在保存时自动优化导入语句（Organize Imports）。

2.  **推荐插件** (`.vscode/extensions.json`)：
    *   创建一个扩展推荐文件，提示您（以及团队其他成员）安装 **Biome** 的 VS Code 插件。

这样配置后，您只需安装推荐的插件，以后在项目中按 `Ctrl+S` (或 `Cmd+S`) 保存文件时，就会自动完成格式化和导入整理。