# Coba GCP Manager

Este é um projeto simples desenvolvido com Electron que demonstra como uma interface de usuário pode simplificar tarefas de configuração na nuvem, como a exportação de Yamls no Google Cloud Platform (GCP). Ele visa reduzir erros humanos e facilitar a vida dos profissionais de arquitetura e DevOps.

## Configuração do GCP

Antes de usar este aplicativo, você precisará configurar o Google Cloud Platform (GCP) e garantir que o `gcloud` CLI esteja instalado e configurado corretamente em sua máquina. Siga as etapas abaixo para configurar o ambiente:

### Passo 1: Criar uma Conta do GCP

Se você ainda não tiver uma conta do GCP, acesse [Google Cloud Platform](https://cloud.google.com) e siga as etapas para criar uma conta. Certifique-se de vincular um método de pagamento válido à sua conta.

### Passo 2: Instalar o SDK do Google Cloud

Para usar o `gcloud` CLI, você precisará do SDK do Google Cloud instalado em sua máquina. Você pode baixá-lo e instalá-lo seguindo as instruções em [Instalando o SDK do Cloud](https://cloud.google.com/sdk/docs/install).

### Passo 3: Configurar o `gcloud`

Após a instalação do SDK do Google Cloud, configure o `gcloud` executando o seguinte comando no terminal:

## Configurações
 Dentro do arquivo settings.txt na raiz do projeto adicione as configurações necessárias, como o PROJECT_ID:

 - PROJECT=seu-projeto
 - APPS_LIST=app1,app2,app3
 - REGION=sua-regiao

## Execute a Aplicação
 - npm install
 - npm start