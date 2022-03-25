// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
let timeout;
let registration;
function activate() {
  let config = vscode.workspace.getConfiguration("auto-arrage-tabs");
  if (!config) {
    return;
  }
  function leftTab() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      vscode.commands.executeCommand("moveActiveEditor", {
        to: "first",
        by: "tab",
      });
    }, config.get("time") * 1000);
  }
  vscode.workspace.onDidChangeConfiguration(() => {
    if (registration) {
      registration.dispose();
      config = vscode.workspace.getConfiguration("auto-arrage-tabs");
      registration = vscode.window.onDidChangeActiveTextEditor(() => leftTab());
    }
  });
  registration = vscode.window.onDidChangeActiveTextEditor(() => leftTab());
}
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
