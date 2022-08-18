# vue-appli
## 環境設定ファイルの作成
FirestoreへのAPP KEY等をGit管理配下に保存するのは危険であるため、Git管理外にしています。  
環境ファイルの作成として、プロジェクト実行前に以下の作業を実施してください。  
1. vue-appli/src/フォルダ直下、「main.js.sample」ファイルをコピーし「main.js」へとリネームしてください。
1. Google Firebase[https://console.firebase.google.com/u/0/]にアクセスしてください。
1. アプリの情報へ遷移してください。
1. SDK の設定と構成で「npm」を選択してください。
1. 「次に Firebase を初期化し、使用するプロダクトの SDK の利用を開始します。」の下に表示されているソースコードをコピーしてください。
1. 「main.js」内の  
「// ここから下のサンプルコードを削除し、Firebaseで発行されたSDKのソースコードを貼り付けてください」
「// ここから上のサンプルコードを削除し、Firebaseで発行されたSDKのソースコードを貼り付けてください」  
の間のソースを削除し、コピーしたソースコードを貼りつけてください。  
  
ここまで対応したのちに、以下のVueのデフォルト「Project setup」以降を実施してください。

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### vue-appli
Vue2.x→ Vue3.xへのマイグレーションに伴い、以下の操作を行いました
1. 既存のプロジェクトを利用せず、vue create vue-appliコマンドを元に新規プロジェクトを作成
1. vue-appli/src/routerフォルダに既存プロジェクトのファイルを上書き
1. vue-appli/src/sotre フォルダに既存プロジェクトのファイルを上書き
1. vue-appli/src/views フォルダに既存プロジェクトのファイルを上書き
1. vue-appli/src/App.vue ファイルを既存プロジェクトのファイルを上書き
1. vue-appli/src/main.js ファイルを既存プロジェクトのファイルを上書き
1. Vue2.x→Vue3.xの以下変更点に対して各種修正を実施
   + Vue3の変更に伴い削除になった箇所については「Vue3への変更に伴いコメントアウト ここから」「Vue3への変更に伴いコメントアウト ここまで」というコメントをつけています
   + Vue3の変更に伴い追加になった箇所については「Vue3への変更に伴い追加 ここから」「// Vue3への変更に伴い追加 ここまで」というコメントをつけています





