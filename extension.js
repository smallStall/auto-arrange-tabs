// @ts-check
const vscode = require('vscode');

let timeout, registration;

const getNotPinnedNum = (activeGroup) => {
  for (let i = 0; i < activeGroup.tabs.length; i ++) {
    if (!activeGroup.tabs[i].isPinned) return i;
  }
};

const getActiveTabNum = ({ activeTab, tabs }) => {
  for (let i = 0; i < tabs.length; i ++) {
    if (activeTab.label === tabs[i].label) return i;
  }
};

const activate = () => {
  let config;
  const setConfiguration = () => {
    config = vscode.workspace.getConfiguration('auto-arrange-tabs');
  };

setConfiguration();
  if (!config) return;

  const leftTab = () => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
        const activeGroup = vscode.window.tabGroups.all.filter((group) => group.isActive)[0];
        if (!activeGroup) return;

        // Find tab numbers with matching labels.
        const tabNum = getActiveTabNum(activeGroup);
        if (tabNum < config.get('fixTabs')) return;

        const notPinnedNum = getNotPinnedNum(activeGroup);
        vscode.commands.executeCommand('moveActiveEditor', {
          by: 'tab',
          to: 'left',
          value: tabNum - notPinnedNum,
        });
      },
      config.get('millis'),
    );
  };

  const setRegistration = () => {
    registration = vscode.window.onDidChangeActiveTextEditor(leftTab);
  };

  vscode.workspace.onDidChangeConfiguration(() => {
    if (!registration) return;

    registration.dispose();
    setConfiguration();
    setRegistration();
  });

  setRegistration();
};

const deactivate = () => {};

module.exports = { activate, deactivate };
