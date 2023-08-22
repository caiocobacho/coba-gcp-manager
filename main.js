const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Registre o método 'executeCommand'
ipcMain.handle('executeCommand', (event, data) => {
    // Aqui você pode adicionar a lógica para executar comandos
    // Certifique-se de importar e usar 'child_process' ou outras dependências necessárias aqui
    const exec = require('child_process').exec;

    return new Promise((resolve, reject) => {
        exec(data.command, (error, stdout, stderr) => {
            if (error) {
                reject({ error: error.message });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
});

// Registre o método 'get-settings'
ipcMain.handle('get-settings', (event) => {
    // Lê o arquivo settings.txt e envia as configurações para o processo de renderização
    const settingsData = fs.readFileSync('settings.txt', 'utf-8');
    const settings = {};
    settingsData.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            settings[key.trim()] = value.trim();
        }
    });
    return settings;
});

ipcMain.handle('exportJobYAML', async (event, data) => {
    const { jobName } = data;
    const outputFolder = 'yamls';

    // Lê as configurações do arquivo settings.txt
    const settingsPath = path.join(__dirname, 'settings.txt');
    const settingsData = fs.readFileSync(settingsPath, 'utf-8');
    const settings = {};
    settingsData.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            settings[key.trim()] = value.trim();
        }
    });

    // Obtém o valor do projeto do arquivo settings.txt
    const project = settings.PROJECT;

    // Constrói o comando com o valor do projeto
    const command = `gcloud beta run jobs describe ${jobName} --format='yaml' --project=${project} --region=southamerica-east1 > ${outputFolder}/${jobName}.yaml`;

    console.log('Executing command:', command);

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error:', error.message);
                reject({ error: error.message });
            } else {
                console.log(`YAML exported to ${outputFolder}/${jobName}.yaml`);
                resolve({});
            }
        });
    });
});
