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

function getNotPinnedNum(activeGroup) {
  let i;
  for (i = 0; i < activeGroup.tabs.length; i++) {
    if (!activeGroup.tabs[i].isPinned) {
      break;
    }
  }
  return i;
}

function getActiveTabNum (activeGroup) {
  const activeTab = activeGroup.activeTab;
  let i;
  for (i = 0; i < activeGroup.tabs.length; i++) {
    if (activeTab.label === activeGroup.tabs[i].label) {
      break;
    }
  }
  return i;
}

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
      const activeGroup = vscode.window.tabGroups.all.filter(
        (group) => group.isActive
      )[0];
      if (!activeGroup) {
        return;
      }

      //ラベルが合っているタブ番号を探す
      const tabNum = getActiveTabNum(activeGroup);
      if (tabNum < config.get("fixTabs")) {
        return;
      }

      const notPinnedNum = getNotPinnedNum(activeGroup);
      console.log(notPinnedNum);
      vscode.commands.executeCommand("moveActiveEditor", {
        to: "left",
        by: "tab",
        value: tabNum - notPinnedNum
      });
    }, config.get("seconds") * 1000);
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
