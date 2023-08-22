const fs = require('fs');
const { ipcRenderer, shell } = require('electron');

const listInstancesButton = document.getElementById('loginGCP');
listInstancesButton.addEventListener('click', () => {
    // Solicitar o projectId ao processo principal
    ipcRenderer.invoke('get-settings')
        .then(projectId => {
            // Agora você pode usar o projectId para executar os comandos
            ipcRenderer.invoke('executeCommand', {
                command: `gcloud auth login && gcloud config set project ${projectId}`
            }).then(response => {
                const { stdout, stderr } = response;
                if (stderr) {
                    console.error(`Error: ${stderr}`);
                    alert(`Error: ${stderr}`);
                    return;
                }
                const instanceList = document.getElementById('instanceList');
                instanceList.innerHTML = '';
                const instances = stdout.split('\n').slice(1); // Remove o cabeçalho
                instances.forEach(instance => {
                    const li = document.createElement('li');
                    li.textContent = instance;
                    instanceList.appendChild(li);
                });
            }).catch(error => {
                console.error(`Error: ${error.message}`);
                alert(`Error: ${error.message}`);
            });
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
            alert(`Error: ${error.message}`);
        });
});

// Adicione um evento de clique para o botão "Export YAMLs Jobs"
const exportJobsButton = document.getElementById('exportJobs');
exportJobsButton.addEventListener('click', () => {
    // Solicita as configurações ao processo principal
    ipcRenderer.invoke('get-settings').then(settings => {
        // Agora você pode usar as configurações obtidas aqui
        const appsList = settings.APPS_LIST.split(',');

        // Pasta de saída para os YAMLs
        const outputFolder = 'yamls';

        // Certifique-se de que a pasta de saída existe
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }

        // Função para exportar YAML para um aplicativo
        function exportYAML(app) {
            ipcRenderer.invoke('exportJobYAML', { jobName: app })
                .then(response => {
                    if (response.error) {
                        console.error(`Error: ${response.error}`);
                    } else {
                        console.log(`YAML exportado para ${outputFolder}/${app}.yaml`);
                    }
                })
                .catch(error => {
                    console.error(`Error: ${error.message}`);
                });
        }

        // Exportar YAMLs para todos os aplicativos na lista
        appsList.forEach(app => {
            exportYAML(app);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const linkedinLink = document.getElementById('linkedin-link');
  
    linkedinLink.addEventListener('click', () => {
      shell.openExternal('https://www.linkedin.com/in/caio-cobacho-bba918117/');
    });
  });