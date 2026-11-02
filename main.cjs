const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // 데스크톱 앱 창 생성
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false, // 보안을 위해 false 권장
            contextIsolation: true,  // 보안 설정
        }
    });

    //mainWindow.webContents.openDevTools();

    // 개발 중일 때는 로컬 서버를 로드할 수도 있지만,
    // 완벽히 로컬 프로그램으로 실행할 때는 빌드된 index.html 파일을 로드합니다.
    //mainWindow.loadFile(path.join(__dirname, './dist/index.html'));
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

    // (참고: Vite를 사용해 dist 폴더가 생겼다면 './dist/index.html'로 경로를 수정하세요)
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});