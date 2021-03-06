const electron = require("electron");
const { app, Tray, Menu, nativeImage } = require("electron");

// Module to control application life.
// const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1920, height: 1080, webPreferences: { nodeIntegration: true } });

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true,
    });
  mainWindow.loadURL(startUrl);
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.removeMenu();

  const iconPath = path.join(__dirname, "/../assets/win.ico");

  mainWindow.tray = new Tray(nativeImage.createFromPath(iconPath));
  // 右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "退出",
      click: () => {
        mainWindow.destroy();
      },
    },
  ]);
  mainWindow.tray.setToolTip("ErP");
  mainWindow.tray.setContextMenu(contextMenu);
  mainWindow.tray.on("click", () => {
    // 监听单击做的时
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // 当我们点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
  // event.preventDefault(); 禁止关闭行为(非常必要，因为我们并不是想要关闭窗口，所以需要禁止默认行为)
  mainWindow.on("close", event => {
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);
    event.preventDefault();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
