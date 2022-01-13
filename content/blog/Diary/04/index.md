---
title: "ブログにキーワード検索機能を追加しました"
postdate: "2022-01-05"
update: "2022-01-09"
seriesName: "日記"
seriesSlug: "Diary"
description: "当ブログにキーワード検索機能を追加したので記事にします。"
tags: ["Gatsby", "Gatsby Blog"]
keywords: ["Gatsby", "Blog", "ブログ", "React Hooks"]
---

# ブログにキーワード検索機能を追加しました

タイトルのまんまです。右上にある虫眼鏡ボタンをクリックすればテキストボックスが現れ、キーワードによる記事の絞り込み検索ができます。

絞り込み検索はインクリメンタルサーチとも呼ばれ、ページ遷移を伴うことなく段階的に記事を絞り込んでいきます。

「g」と入力した場合（10件）。

![](./images/image01.png)

「git」と入力した場合（4件）。

![](./images/image02.png)

「git log」と入力した場合（3件）。

![](./images/image03.png)

このブログは既にシリーズ検索とタグ検索の機能を持っておりこれ以上の検索機能は不要かと思ったのですが、年末年始が非常に暇だったこともあり実装しました。

今回はこの検索機能について、そしてその実装方法を解説します。

## JSONファイルから検索する

さて、静的サイトでの検索機能といえば[algolia](https://www.algolia.com/)が真っ先に思い浮かびますね。私も利用しようと思って色々調べてみたのですが、

- 🤔 algoliaに関する知識が全くない
- 🤔 料金がかかるかもしれない 
- 🤔 Sassなどの外部サービスを利用するのは大げさ
- 🤔 全文検索は必要ない

などの理由から導入はしないことにしました。今回は、Gatsbyのビルドプロセス時に各記事のfrontmatterからJSONファイルを作成し、コンポーネントからJSONファイルを検索する、という至極シンプルな方法をとることにしました。

## frontmatterにkeywordsを追加する

次に、検索対象をどうしようかと考えました。ぱっと思いつくのは

- 🔍 記事のタイトル
- 🔍 シリーズ名
- 🔍 タグ
- 🔍 description
- 🔍 記事本文（全文検索）

くらいですが、全てを対象にするとロジックが複雑になるうえJSONファイルも肥大化するのでやめました。記事本文もJSONファイルの肥大化、そしてそこまで必要ないという理由で却下。シリーズ名、タグ名による検索もほぼ同じ機能が既にあるので却下。タイトルやdescriptionは検索対象としては情報量が不足するということで却下。

いくつかの要素を組み合わせようかとも思いましたが、グタグタ考えるくらいならfrontmatterに新しい項目を追加してしまおうということで、「keywords」という項目を追加しました。キーワードとなる単語を配列に格納していきます。

追加する言葉は「タグよりも粒度の細かい言葉」にしました。タグにするほどではないけど本文に何回か出現する言葉ですね。タグと本文の中間くらいのイメージです。

また、「Blog」「ブログ」などの日本語/英語のゆれ、「SSG」「Static Site Generator」などの略す/略さないというゆれはタグ検索では実現しにくいです。機能を追加する利点、モチベーションになると思い、面倒臭いですが細かに記述していきます。

```yaml
---
# 例えばこんな感じ
keywords: ["Gatsby", "Blog", "ブログ", "SSG", "Static Site Generator"]
---
```

## 要件定義

ここで、簡単に要件定義をしておきます。

- ✔️ 入力した文字列をキーワードとして持っている記事を検索し、その記事へのリンクをリストアップする
- ✔️ 「キーワード」は、各記事のfrontmatterとして定義する
- ✔️ 半角スペースを用いて複数の単語を入力可能にする
- ✔️ 複数の文字列が入力された場合はAND検索を行う（AAA BBBと入力されれば、その両方を持っている記事をリストアップする）
- ✔️ 英語、日本語を入力対象とする
- ✔️ アルファベットはケース・インセンシティブにする（検索時に大文字を内部的に小文字に変換して比較を行う）
- ✔️ ページ遷移なしの絞り込み検索を行う

これらを元に機能を実装していきます。

## ビルド時にJSONファイルを書き出す

各記事に`keywords`を用意したら、JSONファイルを書き出す機能を実装します。Gatsbyのビルドプロセス時にJSONファイルを生成するので、編集するのは`gatsby-node.js`ですね。

まずは、全ての記事の`frontmatter`の`keywords`項目を取得するGraphQLクエリーを追加します。

```typescript:title=gatsby-node.js
const createPages = async ({ graphql, actions, reporter }) => {

  const queryResult = await graphql(
    `
      ...略
      {
        # 全ての記事を取得(検索用)
        allArticlesForSearching: allMarkdownRemark(
          sort: {fields: frontmatter___postdate, order: DESC}
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                keywords
                title
              }
            }
          }
        }
      }
    `
```

JSONファイルの書き出しは以下のように行います。ファイルの保存先はルート直下の`static`にしました。

```typescript:title=gatsby-node.js
  const keywords = queryResult.data.allArticlesForSearching.edges.map(({node}) => {
    return {
      slug: node.fields.slug,
      title: node.frontmatter.title,
      keywords: node.frontmatter.keywords,
    }
  })

  fs.writeFileSync('./static/keywordSearch.json', JSON.stringify(keywords, null, 2))
```

ここで`gatsby develop`すると、`/static/keywordSearch.json`が生成されます。また、その内容は以下のようになっているはずです。

```json:title=/static/search.json
[
  {
    "slug": "/Others/01/",
    "title": "プロキシ環境でKali Linuxを使う",
    "keywords": [
      "Kali Linux",
      "WSL2",
      "Proxy",
      "プロキシー",
      "apt",
      "wget",
      "curl"
    ]
  },
  //...略
]
```

## gatsby-transformer-jsonをインストールする

JSONファイルを生成できたので、次はこれをコンポーネントから取得します。Gatsbyには`gatsby-transformer-json`というパッケージが用意されており、これを使うことでGraphQLクエリーでJSONファイルを取得できます。早速インストールしましょう。

なお、`gatsby-transformer-json`は、2022年1月現在`^4.4.0`が最新なようですが、Gatsby v3を使用している環境だと「warn Plugin gatsby-transformer-json is not compatible with your gatsby version 3.12.1 - It requires gatsby@^4.0.0-next」みたいなエラーが出るはずです。

Gatsby v4を使用しているのであれば問題ありませんが、Gatsby v3を使用中の方は`gatsby-transformer-json@^3.0.0`をインストールしましょう。

```shell
$ yarn add gatsby-transformer-json@^3.0.0
```

インストールできたら、まずは`gatsby-config.js`のプラグインの部分に追記します。

```javascript:title=/gatsby.config.js
module.exports = {
  plugins: [
    `gatsby-transformer-json`,
    // ...略
  ]    
```

また、`/static/search.json`を扱うわけですから、`gatsby-source-filesystem`において`/static`への設定をしている必要があります。設定が出来ていない場合は以下のように追記します。

```javascript
  // 追記
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `static`,
      name: `keywordSearch`,
    },
  },
```

ここで再度`gatsby develop`を行い、`localhost:8000/___graphql`にアクセスし、GraphiQLでGraphqlクエリーを発行し、JSONファイルを取得できるかテストしてみましょう。

JSONファイルを取得するクエリーの名前ですが、保存しているJSONファイルのファイル名が踏襲されます。今回は`search.json`という名前でJSONファイルが存在しているので、`allKeywordSearchJson`ないし`searchJson`というクエリーが用意されているはずです。

![](./images/image04.png)

GraphQLクエリーは以下のように投げます。取得するフィールドですが、肝心の`keywords`と、検索でヒットした記事へのリンクを作成するために`slug`と`title`も必要です。

```graphql
{
  allSearchJson {
    edges {
      node {
        keywords
        slug
        title
      }
    }
  }
}
```

クエリーを実行して右側のペインにエラーなく結果が表示されればOKです。以下は筆者の環境でのクエリーの結果です。

```javascript:title=Graphqlクエリーの結果
{
  "data": {
    "allSearchJson": {
      "edges": [
        {
          "node": {
            "keywords": [
              "Gatsby",
              "Blog",
              "ブログ",
              "React Hooks"
            ],
            "slug": "/Diary/04/",
            "title": "ブログにキーワード検索機能を追加しました"
          }
        },
        // ...略
      ]
    }
  },
}
```

## コンポーネントを作成する

ここまでくれば目的の大半は達成したも同然です。記事を検索するコンポーネントを作成しましょう。`/src/components/search.tsx`を用意します。まずは以下のように記述しておきます。

```jsx:title=/src/components/search.jsx
import React from "react"

export const Search = () => {
  return (
    <p>This is a search component</p>
  )
}
```

次に、GraphQLクエリーを記述します。コンポーネントからクエリーを投げるわけですから`useStaticQuery`を利用します。`useStaticQuery`と`graphql`をインポートし、以下のように記述します。適当な所に`console.log(allSearchJson)`を仕込み、結果を確認できるようにしておきます。

```jsx{2}:title=/src/components/search.jsx
import React from "react"
import {useStaticQuery, graphql} from "gatsby"

export const Search = () => {
  const { allSearchJson } = useStaticQuery(
    graphql`
      query {
        allSearchJson {
          edges {
            node {
              keywords
              slug
              title
            }
          }
        }
      }
    `
  )

  console.log(allSearchJson)

  return (
    <p>This is a search component</p>
  )
}
```

ファイルができたら、適宜`/src/components/layout.jsx`などにコンポーネントを追記します。`gatsby develop`でローカルサーバーを起動し、ページにアクセスしコンソールで結果を確認します。

![](/images/image102.png)

今回、UIの作成には`useState`と`useEffect`を使用します。まずは`useState`で入力された文字列を保持するStateと、条件によって絞り込まれた記事すべてを保持するStateを用意します。

ついでに入力フォームも書いておきましょう。

```jsx:title=/src/components/search.jsx
const Search = () => {

  // ...略

  // フォームに入力された文字列を保持するState
  const [inputtedKeyword, setInputtedKeyword] = useState("")

  // 条件によって絞り込まれた記事を保持するState
  const [filteredPosts, setFilteredPosts] = useState(null)

  return (
    <input type="text" />
  )
}
```

今回はインクリメンタルサーチですから、入力ボックスに1文字入力されるたびに`allSearchJson`を走査して、結果を書き換える必要があります。

まずはinput要素に`onChange`属性を定義し、入力された文字列を`setInputtedKeywords`に渡すようにします。

```jsx:title=/src/components/search.jsx
  return (
    <input
      type="text"
      onChange={(e) => setInputtedKeywords(e.target.value)}
    />
  )
```

続けて、`useEffect`を定義し、第二引数に`inputtedKeywords`を渡します。これで入力フォームに書き込まれるたびに`useEffect`が実行される状態になりました。`useEffect`には`console.log(inputtedKeywords)`などと記述し、フォームに1文字入力されるたびにコンソール出力されることを確認してください。

```jsx:title=/src/components/search.jsx
const Search = () => {
  // ...略

  // フォームに文字列が入力されるたびに実行される
  useEffect(() => {
    console.log(inputtedKeywords)

    // ここにinputtedKeywordsの中身を使ってJSONファイルを走査し、
    // filteredPostsを書き換える処理を書く

  }, [inputtedKeywords])

  return (
    <input
      type="text"
      // 入力された文字列でinputtedKeywordsを更新する
      onChange={(e) => setInputtedKeywords(e.target.value)}
    />
  )
}

export default Search
```

それでは`useEffect`の処理を記述します。まずは入力された文字列を全て小文字に変換し、`lowerCaseKeywords`といった変数に保管します。

```jsx:title=/src/components/search.jsx
useEffect(() => {
  // 入力されたキーワードを小文字に変換する
  const lowerCaseKeywords = inputtedKeywords
    .trim()
    .toLocaleLowerCase()
    .match(/[^\s]+/g)
}, [inputtedKeywords])
```

また、検索しヒットした記事は`searchedResult`配列に格納することにしましょう。

```jsx:title=/src/components/search.jsx
// ヒットした記事がここに格納される
const searchedResult = // 検索処理を書く
```

肝心のヒットするかどうかを判定する部分ですが、私は以下のように書きました。

```jsx:title=/src/components/search.jsx
const searchedResult = edges.filter(({node}) => {
  return lowerCaseKeywords?.every((keyword) => {
    return node?.keywords?.toString().toLocaleLowerCase().includes(keyword)
  })
})

// 結果確認用
console.log(searchedResult)
```




