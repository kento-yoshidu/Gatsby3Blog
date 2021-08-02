---
title: "プロトタイプオブジェクト"
postdate: "2021-04-28"
updatedate: "2021-04-28"
categoryName: "JavaScript中級者を目指す"
categorySlug: "JavaScriptAdvance"
description: "JavaScriptの持つデータ型について解説します。長くなってしまうので前後2つの記事に分けて解説します。"
tags: ["JavaScript"]
---

## オブジェクトを作成する

難しいことは後回しにして、まずはオブジェクトを作成し利用してみたいと思います。

オブジェクトには、プリミティブ型と同じように**オブジェクトリテラル**である`{}`が用意されています。具体的には以下のようにしてオブジェクトを作成します。`typeof`で確認すると、オブジェクトであることがわかります。

```javascript
const myObj = {};

console.log(typeof myObj);
//=> object
```

また、`Object`コンストラクタ関数も用意されていますが、`{}`を使用してオブジェクトを生成するのと何ら変わりありません。`{}`を使用しましょう。

```javascript
const myObj = new Object();

console.log(typeof myObj);
//=> object
```

### データの追加と取得

`myObj`オブジェクトを作成しましたが、何もデータを持っていません。オブジェクトの作成時に、初期値としてデータを持たせることができます。

```javascript
const myObj = {
  name: "kento",
  age: 33,
  gender: "man",
};
```

細かい文法は分からなくても、`myObj`は、ある人の名前、年齢、性別を格納していることは分かると思います。このように、オブジェクトとは**関連する複数のデータをひとまとめにしたもの**であると言えます。

また、**ドット演算子**（`.`）を使用することで、オブジェクトが持っているデータを取り出すことができます。


### プロパティ

オブジェクトが持っているデータを**プロパティ**と呼びます。今回の例だとそれぞれ、`name`プロパティ、`age`プロパティ、`gender`プロパティなどと呼びます。

プロパティの命名ルールは後に紹介する変数の命名ルールと同じです。


## プリミティブ値との違い

# プリミティブとオブジェクト

## プリミティブ値

JavaScriptにおいて、文字列、数値、真偽値、null、undefined、symbolの6つは、**プリミティブ値**であるとされています。

プリミティブは「原始的」などと訳されますが、**これ以上細分化されない**、データそのものと捉えることができます。

これに対してオブジェクトはプロパティやメソッドを持っていることから、プリミティブ値とオブジェクトは対照的な存在であると言えそうです。

```javascript
// プリミティブ値の宣言
const str = "string";
const num = 1;
const bool = true;
const nul = null;
const unde = undefined;
const sym = Symbol();

// オブジェクトの宣言
// idプロパティ、funcメソッドを持っている
const obj = {
  id: 1,

  func() {
    return this.id
  }
}
```

[Primitive (プリミティブ) - MDN Web Docs 用語集: ウェブ関連用語の定義 | MDN](https://developer.mozilla.org/ja/docs/Glossary/Primitive)

[メモリ管理 - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Memory_Management)

```javascript
const obj = new Object();

// nameというプロパティを作成、kentoというデータを格納(ドット記法)
obj.name = "kento"
console.log(obj.name);
//=> kento

// ageというプロパティを作成、33というデータを格納(角括弧記法)
obj["age"] = 33;
console.log(obj["age"]);
//=> 33
```

主流は、ドット記法を使用する方法です。ただ、プロパティ名に数値を使用したいときには角括弧記法を使用しなければいけません。

```javascript
obj.1 = "one";
//=> SyntaxError: Unexpected number

obj[1] = "one";
//=> OK!

obj["item price"] = 30;
//=> OK!
```

本書では、プロパティの追加も呼び出しも基本的にドット記法を使用します。

---

続けて、関数であるメソッドも追加してみます。メソッドも代入演算子を使用して追加できます。

```javascript
(略)

obj.greeting = function() {
  return `I\'m ${this.name}, ${this.age} years.`
}

console.log(obj.greeting())
//=> I'm kento, 33 years.。
```

ここで、オブジェクトの持つ、プロパティやメソッドを取得する方法を考えます。いくつか方法がありますが、ここでは`for...in`構文を試したいと思います。

`key`にはキー（つまり、name、age、greeting）が入ります。そして`obj[key]`とすることで、キーの値を取得することができます。

```javascript
(略)

for(const key in obj) {
  console.log(`${key}: ${obj.key}`)
}
/*
  name: kento
  age: 33
  greeting: function() {
    return `I\'m ${this.name}, ${this.age} years.`
  }
*/
```

## オブジェクトリテラルを使用する

ブラケットを用いてオブジェクトを作成します。これはObjectコンストラクタ関数を使用するのと全く同じことです。

このブラケット`{}`は、**オブジェクトリテラル**と呼ばれています。

```javascript
const obj = {
  name: "kento",
  age: 33,

  greeting: function() {
    return `I\'m ${this.name}, ${this.age} years.`
  }
}

console.log(obj.greeting());
//=> I'm kento, 33 years.
```

## オブジェクトのプロパティは変更できる

現在の状態を整理しておくと、nameプロパティには**kento**、ageプロパティには**33**が格納されています。
代入演算子`=`を使用して、この値を上書きすることができます。

```javascript
obj.name = 'hikari';
obj.age = 20;

console.log(obj.greeting());
//=> I'm hikari, 20 years.
```

そして、greetingメソッドを書き換えることもできます。それも、関数に限らず、例えば真偽値に置き換えることも可能です。

```javascript
// 真偽値を代入
obj.greeting = true;

// ↓ 関数ではなくなったら()はなくす
console.log(obj.greeting);
//=> true
```

## Objectが頂点にある

```javascript
console.log(Object.prototype.toString);
//=> [Function: toString]
```

プロトタイプメソッド ＝ prototypeオブジェクトに組み込まれている

`obj`は`Object.prototype`がもつプロパティを継承しています。よって、`toString()`を使用できます。

### 同じ名前のインスタンスメソッド

同じ名前でインスタンスにメソッドを定義し、呼び出すとどうでしょうか。インスタンスメソッドが優先され実行されます。

```javascript
const obj = {
  toString() {
    console.log('Hello World!')
  }
};

obj.toString();
//=> Hello World!
```

### hasOwnProperty

インスタンス自身がプロパティを持っているかを返します。

```javascript
const obj = {};

console.log(obj.hasOwnProperty('toString'))
//=> false

console.log(Object.prototype.hasOwnProperty('toString'))
//=> true
```

### `in`演算子

インスタンスオブジェクトの**継承元**までさかのぼってプロパティを持っているかを返します。

```javascript
const obj = {};

console.log("toString" in obj)
//=> true
```

## 参考

[Object のプロトタイプ | MDN](https://developer.mozilla.org/ja/docs/Learn/JavaScript/Objects/Object_prototypes)

## 同じプロパティを持つオブジェクトの比較

https://qiita.com/makotoo2/items/fc3a617882916f9775f5
https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures
https://qiita.com/hcr1s/items/172ba167ba44a35c2a45
https://qiita.com/makotoo2/items/9566cebf205ef8b42505
https://qiita.com/sho_U/items/38460b6e9bcd1dae1387
https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object
https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/new


# オブジェクトの操作

## Object.entriesでオブジェクトから配列を取得する

https://jsprimer.net/basic/object/



# Stringクラス

## Stringクラスのプロパティやメソッド

### lengthプロパティ

`length`プロパティは、文字列の文字数を返します。

```javascript
console.log("aaa".length);
//=> 3

console.log("こんにちは".length);
//=> 5
```


<aside>

**文字数**という言葉は正確には正しくありません。**文字コードの数**を返します。

</aside>

文字列型のページで説明しましたが、JavaScriptは内部的に文字コードとしてUTF-16を採用しています。そして**サロゲートペア文字列**は文字コードを2つ組み合わせて1つの文字を表現していますので、lengthメソッドを使用すると`2`が返ってきます。

```javascript
const str = "\u{1F64F}";
const str2 = "\u{23C7F}";

console.log(str);
//=> 🙏

console.log(str.length);
//=> 2

console.log(str2);
//=> 𣱿

console.log(str2.length);
//=>2
```

詳しくはこちら（作成中）を確認ください。

[サロゲートペア入門：CodeZine（コードジン）](https://codezine.jp/article/detail/1592)

[文字列とUnicode · JavaScript Primer #jsprimer](https://jsprimer.net/basic/string-unicode/)

https://itsakura.com/it-unicode-utf


### `includes`,`startsWidth`,`endsWidth`メソッド

この3つのメソッドは、文字列内に**任意の文字列があるかないか**を判定します。戻り値はboolean型です。

まずは`includes`メソッドを使用してみます。引数に任意の文字列を渡し、その文字列が対象の文字列中に含まれているかを判定します。

```javascript
let str = 'Kento Yoshizu';

console.log(str.includes('Kento'))
// => true

console.log(str.includes('to Yo'))
// => true
```

ただし、これらの3つのメソッドは大文字と小文字を区別します。

```javascript
let str = 'Kento Yoshizu';

// kが小文字だからfalse
console.log(str.includes('kento'))
// => false
```

こんな時は先ほど紹介した`toLocalLowerCase`メソッドを使用します。`toLocalLowerCase`メソッドでstr文字列を全て小文字に変換、それを`includes`メソッドに渡して判定します。

```javascript
let str = 'Kento Yoshizu';

// strを小文字に変換してから判定
console.log(str.toLocaleLowerCase().includes('kento'));
// => true
```

`startsWith`メソッドは、**文字列の先頭**に任意の文字列が含まれているかを判定します。

```javascript
let str = "Kento Yoshizu";

console.log(str.startsWith('Kent'));
// => true

// 先頭にはないのでfalse
console.log(str.startsWith('ent'));
// => false
```

`endsWith`メソッドは**文字列の末尾**に任意の文字列が存在しているかを判定します。

```javascript
let str = "Kento Yoshizu";

console.log(str.endsWith("izu"));
// => true

// 末尾にはないのでfalse
console.log(str.endsWith("hiz"));
// => false
```

### [参考]`concat`メソッド

`concat`メソッドは文字列同士を連結します。任意の文字列を引数として渡し、`concat`メソッドを呼び出した文字列の末尾に連結します。

引数の数に制限はありません。3つでも4つでも渡して連結させることができます。

```javascript
console.log("Hello".concat(" World"));
// => Hello World

// 引数を3つ渡す
console.log("Hello".concat(",", "World", "!"));
// => Hello,World!
```

#### `concat`メソッドの代わりに`+`演算子を

`concat`メソッドを**参考**としたのは、MDNが`concatメソッドの代わりに+演算子を使って`と述べているからです。

>性能
concat() メソッドの代わりに 代入演算子 (+ または +=) を使用する事を強くお勧めします。
この性能試験によれば、代入演算子のほうが数倍高速です。

`性能試験`のリンクにアクセスできないので何とも言えないですが、

まぁ、`+`演算子の方がシンプルで直感的に分かりやすいと思いますし。


イミュータブルであるとはこういうことです。今回の例では`str1`から`concat`メソッドを呼び出して`str2`を連結しましたが、`str1`が変更されるわけではありません。連結した新しい文字列が返されますが、`str1`、`str2`は不変（イミュータブル）です。


---

## Optional chaining演算子[ES2020]

何やら難しそうな名前ですが、**null、もしくはundefined**になる可能性があるオブジェクトに対して、安全にアクセスすることができる演算子です。ES2020で登場しました。

objオブジェクトがaプロパティを持っていて、さらにaプロパティがbプロパティを持っていると想定します。bプロパティにアクセスしたければ`obj.a.b`と書きますよね。

```javascript
const obj = {
  a: {
    b: 1
  }
}

console.log(obj.a.b)
//=> 1
```

しかし、このオブジェクトがたまたま**aプロパティを持っていなければ**どうでしょう？TypeErrorになってしまうのです。

```javascript
const obj = {
  //aプロパティがない！
} 

console.log(obj.a.b)
//=> TypeError: Cannot read property 'b' of undefined
```

このたまたま、というところが味噌ですね。基本的にはあるんだから`obj.a.b`としているのに、なかったからってエラーになるとは。ここはundefinedを返してほしいところです。

このエラーを防ぐ方法として、それぞれのオブジェクトやプロパティが存在しているかをチェックするというのがあげられます。例として以下のようにチェックしますが、実にスマートではないですね。

```javascript
const obj = {
  //aプロパティがない！
} 

// objがある かつ aがある かつ bがあるか？
const isExist = obj && obj.a && obj.a.b

console.log(isExist)
// => undefined
```

しかし、ES2020でついに**Optional chaining演算子**が登場します（以下、`?演算子`と略します）。

ない可能性があるプロパティの後ろに`?`をつければ、そのプロパティがなかった時に**undefined**を返してくれます。

```javascript
const obj = {
  // aプロパティがない！
} 

// ないかもしれないaの後ろに?をつける
console.log(obj.a?.b)
//=> undefined
```

そして`[]`でのプロパティ呼び出しにもちゃんと対応しています。

```javascript
const obj = {
  /*
  1: {
    2: 'a'
  }
  */
} 

// ないかもしれない1の後ろに?をつける
console.log(obj[1]?.[2])
//=> undefined
```

また、`?`演算子は関数呼び出しにも使用できます。以下の例ではfunc1関数の第2引数にfunc変数を用意しています。関数が渡されることを想定してそれを実行するのですが

```javascript
function func1(val, func) {
  //渡された何らかの関数を実行
  func();
  return val * val;
}

//関数は渡さずに呼び出し
console.log(func1(5))
//=>TypeError: func is not a function
```

こういう時は`func()`の呼び出し時に`func?.()`としてあげましょう。

```javascript
function func1(val, func) {
  //?.をつける
  func?.();
  return val * val;
}

// エラーにはならず値が返される
console.log(func1(5))
//=> 25
```

しかしOptional chaining（オプショナル チェイニング）演算子って名前は長いですね。また、演算子も`?`なのでググラビリティも低いです。

### Null合体演算子

これは多くの言語で導入されている演算子ですのでご存じの方も多いと思います。


--- データ型の変換

## 明示的なデータ型変換

`Number`、`String`、`Boolean`といった関数を用いることで、明示的に型を変換することができます。

## 暗黙的なデータ型変換

まず、左右が等しいかを判断する`==`と`===`演算子についてですが、`==`は暗黙の型変換が行われます。

左オペランドと右オペランドのデータ型が同じであれば、そのまま比較が行われます。

```javascript

```

これがなかなか曲者で、意図しない結果を招くため、積極的に使用することは少ないでしょう。

例えば、以下の`console.log`の結果は**全てtrue**になります。

```javascript
console.log(undefined == null);
//=> true

console.log(0 == "0");
//=> true

console.log(0 == false);
//=> true

console.log("0" == false);
//=> true
```
この暗黙的な変換を利用して、短くコードをかけることもあるかもしれませんが、少なくとも私は使いこなせる自信がないので、全く使用していません。

100%、ではありませんがほとんど全ての場合で`===`を使用した方がいいと思います。

## 明示的なデータ型変換

### 文字列型への変換

では、様々なデータ型を文字列型へ変換したとき、どのような結果になるかを試してみます。結論から言ってしまえば、数値型への変換とは異なり、全てのデータが文字列へ変換されます（エラーになることはない）。

|渡す文字列|結果|
|--------|----|
|undefined|"undefined"|
|null|"null"|
|true|"true"|
|false|"false"|
|0|"0"|
|-0|"0"|
|Infinity|"Infinity"|
|-Infinity|"-Infinity"|
|NaN|"Nan"|
|{}|[object Object]
|[]|""|
|[9]|"9"|
|['a', 'b']|'a,b'|
|function(){}|function(){}|

※上記の表は、[JavaScript: The Definitive Guide, 7th Edition](https://www.oreilly.com/library/view/javascript-the-definitive/9781491952016/)のP45を参考に、表の一部を抜き出し、編集して記述しています。

「？」となる挙動もありますが、結構有名であり騒がれつくした感もあるのでご存じの方も多いかもしれません。

数値型への変換の挙動と同じように、手順を追って確認していきたいと思います。

参考：[](https://262.ecma-international.org/8.0/#sec-abstract-equality-comparison)

## オブジェクトからプリミティブ値への変換

以下のようなステップを経て、オブジェクトからプリミティブ値の変換を行います。

### オブジェクトから真偽値型への変換

全てのオブジェクトが**true**へ変換されます。

## モジュールの歴史

- JavaScriptにはモジュールがなかった。
- `CommonJS`、`AMD`、`ESModules`は仕様の名前

# CommonJsによるexport

```javascript

// module.jsから関数をエクスポート
module.exports.test = () => {
  consoel.log('testモジュール');
}

// script.js
const test = require('./module.js');

test.test();
// => testモジュール

/*****************************************/

// module.jsから関数をエクスポート
module.exports.test = "testモジュール";

// script.js
const { test } = require('./script')

console.log(test)
// => testモジュール

/*****************************************/

// mojule.jsからオブジェクトをエクスポート
module.exports.test = {
  name: "kento",
  age: 42,
}

// script.js
const { test } = require('./module')

console.log(test)
```
## 参考

[Objectオブジェクトについて[組み込みオブジェクト]](https://noumenon-th.net/programming/2017/02/02/object-built/)
