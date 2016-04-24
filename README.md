Browser-based 4X strategy game. Work in progress.

Play: http://giraluna.github.io/spacegame

### Building

Install [Git](https://git-scm.com/downloads)
and
[Node.JS](https://nodejs.org/en/)
if you need to.

Execute the following commands to clone the repository and install required depndencies.
```bash
git clone https://github.com/giraluna/spacegame.git
cd spacegame
npm install
```
Compile Typescript and .less files.
```bash
npm run build
```

To run the game locally you need to host it on a http server.

Simple http server using node:
```bash
npm install -g http-server
http-server
```
