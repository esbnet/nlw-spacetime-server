
![imagem de configurações](./src/assets/arch-back.png)

# Back-end / [Front-end](https://github.com/esbnet/nlw-spacetime-web) / [Mobile](https://github.com/esbnet/nlw-spacetime-app)
<div align="center">

![imagem de configurações](./src/assets/logo.png)

</div>

## Rede Social para Devs 

Aqui temos a camada back-end do aplicativo que tem como objetivo permitir o registro de um acontecimento através de um post informando uma imagen/vídeo e um texto descrevendo o fato.

Teremos no back-end a autenticação do usuário, a permissão de rotas e o logout do usuário, o upload dos arquivos de imgem armazenando em disco (ideal seria um serviço na núvem), bem como os end-points para criar, editar, excluir ou deletar uma memória.


<a id="menu"></a>
## Conteúdo
- [Techs](#techs)
- [Arquitetura](#arch)
- [Pré-requisitos](#requisitos)
- [Criar Tabelas no Banco](#database)
- [Funcionalidades / End-Points](#features)
- [Instação e Execução](#install)
- [Registrar Aplicação OAuth - Github ](#registroGithub)

<a id="techs"></a>
## Techs 
- node
- axios
- fastify
  - @fastify/cors
  - @fastify/jwt
  - @fastify/multipart
  - @fastify/static
  - @prisma/client
- prisma / SQLite
- typescript
- tsx
- dotenv
- eslint
- zod

<p style="text-align:right"><a href="#menu">menu</a> &uarr;</p>

<a id="arch"></a>
## Arquitetura do projeto / Autenticação OAuth (Github)

A seguir descrevemos as etapas para a autenticação dos clientes (web/mobile) no Github.

1. No cliente (web/mobile), ao clicar em "Criar sua conta", a aplicação aciona o Github com o "GITHUB_CLIENT_ID" préviamente registrado;
2. Após auntenticação no github, ele fornece um código que é enviado para o end-point `/register`;
3. Aqui no back-end, o código recebido do cliente é enviado para o github juntamente como `client_id` e `client_secret` que estão nas variáveis de ambiente;
4. O github devolve um `access_token` e com ele nós fazemos uma chamada na api do git (`https://api.github.com/user`) para pegar os dados do usuário;
5. Neste momento, é verificado no bando de dados do server se este usuário já é cadastrado. Caso não seja, o server registra no banco e em seguida retorna um `access_token` para a chamada do cliente (web/mobile) confirmando a autenticação.

Após este processo, de posse do `access_token`, os clientes poderão realizar chamadas a api do back-end.

![imagem de configurações](./src/assets/arch-back.png)

<p style="text-align:right"><a href="#menu">menu</a> &uarr;</p>

<a id="requisitos"></a>
## Pré-requisitos
- node versão >= 16.16.0
- npm versão >= 5.2.0 (já trás o npx)
- Registrar aplicação OAuth no Github (web e mobile) [Veja como](#registroGithub) &darr;
- Criar tabelas no banco

<p style="text-align:right"><a href="#menu">menu</a> &uarr;</p>

<a id="features"></a> 
## Funcionalidades / Endpoints (api)

host:  http://localhost:3333
- [x] Login / Registro - `POST /retister`
- [x] Inclusão de memória - `POST /memories`
- [x] Listagem de memória - `GET /memories`
- [x] Edição de memória - `PUT /memories/id` 
- [x] Deleção de memória - `DELETE /memories/id`
- [ ] Filtro de data

<p style="text-align:right"><a href="#menu">menu</a> &uarr;</p>

<a id="database"></a>
## Criar Tabelas No Banco

Toda a configuração do banco está pronta, porém é necessário a criação das tabelas utilizando o prisma.

Lembrando que é nessário incluir nas variáveis de ambiente o caminho para grabação do banco de dados, que neste caso estamos utilizando o SQLite.

```
DATABASE_URL="file:./data/dev.db"
```

Após esta configuração, basta abrir o terminal na pasta do projeto e rodar o comando a seguir:
```
npx prisma generate 
npx prisma migrate
```
Para confirmar a criação das tabelas você pode utilizar a ferramenta "Prisma Studio".
```
npx prisma studio
```

Para mais informações, consute a documentação : [Prisma - SQLite](https://www.prisma.io/docs/concepts/database-connectors/sqlite) / 
[Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

<p style="text-align:right"><a href="#menu">menu</a> &uarr;</p>

<a id="install"></a>
## Instação e Execução

Para instalar e roda o servidor node basta seguir os passos descritos abaixo:
1. Clonar o projeto: 
```
    git clone https://github.com/esbnet/nlw-spacetime-server.git
```
2. Entrar na pasta do projeto:  
```
    cd nlw-spacetime-server
```
3. Instalar dependências: 
```
    npm install
```
4. Criar na pasta raiz o arquivo `.env` e configurar as credencias geradas no gitrub. Será necessário uma credencial para o acesso via web e outra para acesso via mobile. (Registrar aplicação OAuth no Github [Veja como](#registroGithub) &darr;)
```
    # para aplicação web
    GITHUB_CLIENT_ID_WEB={seu código aqui}
    GITHUB_CLIENT_SECRET_WEB={seu código aqui}

    # para aplicação mobile
    GITHUB_CLIENT_ID_APP={seu código aqui}
    GITHUB_CLIENT_SECRET_APP={seu código aqui}
```
5. Rodar o aplicativo: 
```
    npm run dev
```
6. Criar a variável: 
```
    NEXT_PUBLIC_GITHUB_CLIENT_ID=código_client_id_gerado_no_git
```
7. Criar a variável contendo endereço e porta do servidor (back-end/api)
```
    NEXT_PUBLIC_SERVER_URL=http://0.0.0.0:3333
```

<p style="text-align:right"><a href="#menu">menu</a> &uarr;</p>

<a id="registroGithub"></a>
## Registrar aplicação OAuth no Github 

Abaixo você encontra o passo-a-passo para criar as credencias para que sua aplicação possa realizar a autenticação via Github.

Atalho:
[https://github.com/settings/applications/new](https://github.com/settings/applications/new)

| Passos      |tela        |
| ----------- |:-------------:|
| 1. Clique em settins|![imagem de configurações](./src/assets/settins.png)|
| 2. Clique em Developer settings|![imagem de configurações](./src/assets/dev_settins.png)|
| 3. Clique em OAuth|![imagem de configurações](./src/assets/OAuth.png)|
| 4. Clique em New OAuth App|![imagem de configurações](./src/assets/new_app.png)|
| 5. Preencha os campos com os dados abaiso: <br>spacetime-web<br>http://localhost:3000<br>(opcional)<br>http://localhost:3000/ (para onde será redirecionado após o login)|![imagem de configurações](./src/assets/OAuthAplication.png)|

Consulte a documentaçãod o github para mais detalhes:
[Autorizando Aplicativos OAuth](https://docs.github.com/pt/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)

<p style="text-align:right"><a href="#menu">menu</a> &uarr;</p> 


---
<div align="center">

Este projeto foi construido durante um dos bootcamps promovido gratuitamente pela [rockeseat 🚀](https://rocketseat.com.br) que vem ajudando a carreira de milhares de devs em todo o Brasil. Parabéns aos envolvido!!
<br>
![imagem de configurações](./src/assets/rocketseat-logo.svg)

</div>