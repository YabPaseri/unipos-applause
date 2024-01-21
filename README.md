# Web Extension Base

このプロジェクトは、 `React` + `TypeScript` + `Vite` で構成されています。<br>
使用するパッケージマネージャは `pnpm` です。

## 準備

1. 以下ファイルの調整
    - `/package.json` : name,description,version を変更
    - `/.env` : VITE_APP_TITLE を変更
2. `pnpm install` を実行

## Tips

-   `.eslintrc.json` の `rules > import/no-restricted-paths` に、import範囲を記載している。<br>
    フォルダの追加時には、この設定に変更が必要かどうかを考える
-   `tsconfig.json` の `compilerOptions > paths` に、importのエイリアスを記載している。<br>
    フォルダの追加時には、この設定に変更が必要かどうかを考える
-   `docs/commit-message.html` として、コミットメッセージに使いそうな gitmoji を列挙している。コピーもしやすくしているので、参考に。
-   `pnpm verup` で、このパッケージのバージョンが上がるようにしている。そのまま拡張機能のバージョンとしても使用されるので、適宜上げること。
