# このレポジトリについて
このレポジトリは  
https://github.com/yanagita-y/vue4/  
上記レポジトリをvue2.xからvue3.xにマイグレーションした作業の作業ログとなります。  

## @vue/cliについて
nodeのgrobal環境を汚さないために、@vue/cliのインストールにはグローバルオプション（-g）を利用していません。  
vue/cliのコマンド「vue」を利用したい場合は
```
vue <command> [options]
```
と実行するところを
```
./node_modules/@vue/cli/bin/vue.js <command> [options]
```
と実行してください。  
  
vueプロジェクトについては以下のコマンドを実行して作成しています。
```
./node_modules/@vue/cli/bin/vue.js create vue-appli
```

## 環境について
このレポジトリは以下の環境で動作を確認しています。
| 名前 | 確認コマンド | 実行結果 |  
| --- | --- | --- |  
| Node.js | node -v | v17.4.0 |
| npm | npm -v | 8.3.1 |
| @vue/cli | ./node_modules/@vue/cli/bin/vue.js -V | 5.0.8 |

## Vueプロジェクトの設定項目について
```
./node_modules/@vue/cli/bin/vue.js create vue-appli
```
上記コマンド実行時には以下の設定を行っています。
 ```
 ? Please pick a preset: 
  Default ([Vue 3] babel, eslint) 
  Default ([Vue 2] babel, eslint) 
❯ Manually select features 

? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing

? Choose a version of Vue.js that you want to start the project with (Use arrow keys)
❯ 3.x 
  2.x 

? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n) y

? Pick a linter / formatter config: (Use arrow keys)
❯ ESLint with error prevention only 
  ESLint + Airbnb config 
  ESLint + Standard config 
  ESLint + Prettier 

? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◉ Lint on save
 ◯ Lint and fix on commit

? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)
❯ In dedicated config files 
  In package.json  

? Save this as a preset for future projects? (y/N) n
```

## Vueプロジェクトの利用方法について
```
cd ./vue-appli/
```
を実行し、READMEをご確認ください。