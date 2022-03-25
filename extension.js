// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
let timeout;
function activate(context) {
  /*
     context.subscriptions.push(vscode.commands.registerCommand("auto-arrange-tabs", () => {
         vscode.commands.executeCommand("moveActiveEditor", {
             to: "first",
             by: "tab",
         });
     }));
     */
  const config = vscode.workspace.getConfiguration("auto-arrage-tabs");
  if(!config || !vscode.window.activeTextEditor){
    return;
  }
  let disposable = vscode.window.onDidChangeActiveTextEditor(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      vscode.commands.executeCommand("moveActiveEditor", {
        to: "first",
        by: "tab",
      });
    }, config.get("time") * 1000);
  });
  context.subscriptions.push(disposable);
}
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
