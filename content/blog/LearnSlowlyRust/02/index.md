---
title: "#2 列挙型とパターンマッチ"
postdate: "2023-10-08"
update: "2023-10-08"
seriesName: "ゆっくり学ぶRust"
seriesSlug: "LearnSlowlyRust"
description: "Rustの列挙型とパターンマッチについて学びます。"
tags: ["Rust", "列挙型"]
keywords: ["Rust", "列挙型", "enum"]
published: false
---

# 列挙型とパターンマッチ

Rustにおいて**列挙型**は、**あらかじめ列挙された値のみをとれる**ことを表す型の一種です。Rustの特徴的な型であるOption型とResult型の理解のためには、まず列挙型を理解しなければなりません。この記事で列挙型を紹介して以降の記事でOption型やResult型を紹介します。

また、列挙型はmatch式と組み合わせることでその力を発揮します。また、match式の理解のためにはパターンマッチの考え方も学ばなければいけません。さらに、その発展形として`if-let`と`let-else`も学習します。

## とり得る値だけを「列挙」する

例えば、方角を表す変数を用意したいと思います。変数には`West`、`South`、`East`、`North`（東南西北）のいずれかしか入ってほしくありません。こんな時は`enum`を使って`Direction`列挙型を定義します。

```rust
// Direction列挙型の定義
#[derive(Debug)]
#[allow(unused)]
enum Direction {
    West,
    South,
    East,
    North
}
```

この時、`West`、`South`、`East`、`North`といった列挙体がとり得る値は、**列挙子（Variant）** と呼ばれます。

以下のようにして`Direction`列挙型のインスタンスを生成できます。

```rust
#[derive(Debug)]
#[allow(unused)]
enum Direction {
    West,
    South,
    East,
    North,
}

fn main() {
    let direction = Direction::North;

    println!("{:?}", direction);
    //=> North
}
```

想像に容易いと思いますが、`Direction`列挙体のインスタンスは定義された列挙体以外の値をとることができません（以下、`Direction`列挙体を定義している箇所は省略します）。

```rust
fn main() {
    // NorthEast（北西）なんて方角はとれない
	let directon = Direction::NorthEast;
    /*
        error[E0599]: no variant or associated item named `NorthEast` found for enum `Direction` in the current scope
        --> src/main.rs:11:28
        |
    3   | enum Direction {
        | -------------- variant or associated item `NorthEast` not found for this enum
    ...
    11  |     let directon = Direction::NorthEast;
        |                               ^^^^^^^^^ variant or associated item not found in `Direction`
        }
    */
}
```

### match式と組み合わせる

これだけでは列挙体のメリットはあまりないように感じると思いますが、列挙体はmatch式と組み合わせてこそ力を発揮します。`Direction`列挙体のインスタンスがどの列挙子であるかで処理を分岐させることができます。

```rust
fn main() {
    let direction = Direction::North;

    match direction {
        Direction::West => {
            println!("東に進む");
        },
        Direction::South => {
            println!("南に進む");
        },
        Direction::East => {
            println!("西に進む");
        },
        Direction::North => {
            println!("北に進む");
        }
    }
    //=> 北に進む
}
```

このように、どの列挙体と一致するか、言い換えると**マッチするか**を調べて条件分岐される構文がmatch式です（その名の通りですね）。

match式との組み合わせで強力な所は、**全てのパターン（列挙子）を網羅することが強制される**ことです。例えば`West`の場合のパターンを削除してみると、コンパイルに失敗します。`Direction::West`がカバーされていないというエラーメッセージが出力されていますね。

```rust
fn main() {
    let direction = Direction::North;

    match direction {
        /*
        Direction::West => {
            println!("東に進む");
        },
        */
        Direction::South => {
            println!("南に進む");
        },
        Direction::East => {
            println!("西に進む");
        },
        Direction::North => {
            println!("北に進む");
        },
    }
    /*
        error[E0004]: non-exhaustive patterns: `Direction::West` not covered
        --> src/main.rs:13:11
        |
        13 |     match direction {
        |           ^^^^^^^^^ pattern `Direction::West` not covered
        |
    */
}
```

なお、match式は（その名の通り）「式」なので、値を返すことができます。

```rust
fn main() {
	let direction = Direction::North;

    // msgは&str型
	let msg = match direction {
        Direction::West => {
            "東に進む"
        },
        Direction::South => {
            "南に進む"
        },
        Direction::East => {
            "西に進む"
        },
        Direction::North => {
            "北に進む"
        },
    };

	println!("{}", msg);
    //=> 北に進む
}
```

### 引数として受け取る

関数の引数に列挙型を指定する場合を考えてみます。以下のようにして引数が`Direction`列挙型の列挙子であることを指定します。そしてmatch式を用いることで、引数が`Direction`列挙型のインスタンスであり、かつ、全ての列挙子のパターンをカバーしている関数を定義することができます。

```rust
fn check_directon(direction: Direction) {
    let msg = match direction {
        Direction::West => {
            "東に進む"
        },
        Direction::South => {
            "南に進む"
        },
        Direction::East => {
            "西に進む"
        },
        Direction::North => {
            "北に進む"
        }
    };

	println!("{}", msg);
    //=> 北に進む
}

fn main() {
    check_directon(Direction::North);
}
```

### 標準ライブラリーに含まれる列挙型

標準ライブラリーにもいくつかの列挙型があらかじめ定義されています。ここでは`Ordering`列挙型を紹介します。`Ordering`列挙型は2つの数値を比べ、どちらかが大きい(`Greater`)、小さい(`Less`)、または等しい(`Equal`)という3つの列挙子を持ちます。

以下の例は2つの`i32`を受け取り、`Ordering`列挙型のいずれかの列挙子を返す関数です。

```rust
use std::cmp::Ordering::{self, *};

fn compare(n: i32, m: i32) -> Ordering {
    if n < m {
        Less
    } else if n > m {
        Greater
    } else {
        Equal
    }
}
```

参考 : [プログラミングRust 第2版](https://www.oreilly.co.jp/books/9784873119786/)

これを呼び出すにはmatch式を使いましょう。`compare`からは`Ordering`列挙型の列挙子が返ってくるわけですから、`Less`、`Greater`、`Equal`という全ての列挙子を網羅しましょう、というか網羅しなければなりません。

```rust
fn main() {
    let n = 10;
    let m = 1;

    match compare(n, m) {
        Less => println!("{}の方が{}より小さい", n, m),
        Greater => println!("{}の方が{}より大きい", n, m),
        Equal => println!("{}と{}は等しい", n, m)
    }
    //=> 10の方が1より大きい
}
```

### 列挙子は値を持てる

各列挙子は値を持つことができます。まずは各列挙子がどのような型の値を持つかを定義します。

```rust
#[derive(Debug)]
#[allow(unused)]
enum Direction {
    West(usize),
    South(usize),
    East(usize),
    North(usize),
}
```

次に`()`で値を渡し、値を持ったインスタンスを生成します。

```rust
fn main() {
    let direction = Direction::North(10);
}
```

`check_direction`関数においては、各パターンを`Direction::West(変数)`のようにすれば、列挙子の値を変数に束縛できます。

```rust
fn check_directon(direction: Direction) {
    match direction {
        Direction::West(distance) => {
            println!("東に{}メートル進む", distance);
        },
        Direction::South(distance) => {
            println!("南に{}メートル進む", distance);
        },
        Direction::East(distance) => {
            println!("西に{}メートル進む", distance);
        },
        Direction::North(distance) => {
            println!("北に{}メートル進む", distance);
        },
    }
}

fn main() {
    let direction = Direction::North(10);

    check_directon(direction);
    //=> 北に10メートル進む
}
```

なお、列挙子が持つ値にどうにかして直接アクセスしようとしてもできません。match式や後述するif-let構文などを使用するしてアクセスする必要があります。

```rust
fn main() {
    let direction = Direction::North(10);

    // 🦀❌ こんなことはできない
    // println!("{}", direction.distnce);
    // println!("{}", direction[distance]);
}
```

---

列挙子はそれぞれ異なる型の値を持つことができます。さらに、`usize`などのプリミティブな型だけではなく、構造体なども値として持つことができます。

`Direction`列挙型に新たに`NorthEast`列挙子を追加します。その名の通り、北西を表現する列挙子です。値は`north`、`east`というフィールドを持つ無名構造体です。

```rust
#[allow(unused)]
#[derive(Debug)]
enum Direction {
	West(usize),
	South(usize),
	East(usize),
	North(usize),
	NorthEast { north: usize, east: usize },
}

fn main() {
    let direction = Direction::NorthEast {
        north: 10,
        east: 20
    };
}
```

`check_direction`関数は以下のように書き換えて`NorthEast`とパターンマッチさせましょう。

```rust
fn check_directon(direction: &Direction) {
    match direction {
        Direction::West(distance) => {
            println!("東に{}メートル進む", distance);
        },
        Direction::South(distance) => {
            println!("南に{}メートル進む", distance);
        },
        Direction::East(distance) => {
            println!("西に{}メートル進む", distance);
        },
        Direction::North(distance) => {
            println!("北に{}メートル進む", distance);
        },
        Direction::NorthEast { north: n, east: e } => {
          println!("北に{}メートル、西に{}メートル進む", n, e);
        }
    }
}

fn main() {
	let direction = Direction::NorthEast {
		north: 10,
		east: 20
	};

	check_directon(&direction);
}
```

ここまで見てきたように、列挙型を扱うには`match`もセットで使う必要があります（`match`以外の選択肢もありますが、この後すぐ登場します）。この列挙型の仕組みは、私たちに不便さや制限を課し、堅牢なコードを書かせてくれるガードレールのようなものだと言えます。

## パターンマッチ

さて、この記事のタイトルにもある**パターンマッチ**とはどういう意味なのでしょうか？また、列挙型とどのように関係しているのでしょうか？ここまで読んでいただいたなら想像にたやすいと思いますが、「ある値があるパターンに対してマッチするか」を検査する構文のようなものだと言えます。このパターンマッチという言葉について、もう少し掘り下げて考えてみようと思います。

例えば、`let x = y;`という構文に注目してみましょう。これは値`y`を変数`x`に束縛している、（本当に）親の顔より見ているお馴染みの構文ですね。一般的（?）なプログラミング言語だと「代入」と呼ばれることが多いと思いますが、Rustでは**パターンマッチ**を行っていると言えます。

以下の単純なコードを例にとりますが、パターンマッチとは「式の値`10`がパターン`num`」に一致するかを判定する仕組みだと言えます。

```rust
fn main() {
    let num = 10;
}
```

「いや、そら一致するやろ」って思うかもしれませんが、世の中には「必ずしも一致するとは限らない」事もあるのです。もうちょっと例を見てましょう。

---

おさらいします。親の顔より見た、変数に値を束縛する構文を一般化し、`let PATTERN = EXPRESSION`と表現します。右オペランドの式が左オペランドのパターンにマッチするか？という構文ですね。この見方を元にマッチする場合、マッチしない場合を見ていきましょう。

まずはマッチする場合からですが、大抵の場合がマッチします。上記で見たようにプリミティブ型を束縛する場合もそうですし、タプルや構造体を束縛させる場合も必ずマッチします。

```rust
struct User {
    id: usize,
    name: &'static str
}

fn main() {
    let t = (1, "kento");

    let s = User { id: 1, name: "kento" };
}
```

また、以下のようにタプルや構造体の各値を、個別の変数に分割代入することもできます（The bookの日本語版では[分配と訳されています](https://doc.rust-jp.rs/book-ja/ch18-03-pattern-syntax.html#:~:text=%E3%83%AA%E3%82%B9%E3%83%8818%2D13%3A%20%E6%A7%8B%E9%80%A0%E4%BD%93%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%89%E7%9C%81%E7%95%A5%E6%B3%95%E3%81%A7%E6%A7%8B%E9%80%A0%E4%BD%93%E3%81%AE%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%89%E3%82%92%E5%88%86%E9%85%8D%E3%81%99%E3%82%8B)が、ここでは分割代入とします）。JavaScriptなどでおなじみの構文ですね。

```rust
struct User {
    id: usize,
    name: &'static str
}

fn main() {
    let (t_id, t_name) = (1, "kento");

    let User {id: s_id, name: s_name } = User { id: 1, name: "kento" };
}
```

このパターンマッチが使える場所は様々あります。


## if-let構文

さて、これまでは`West`、`South`、`East`、`North`のそれぞれに個別にどのような文を出力するかを明示してきました。ここで`North`の時だけ何かを処理にして、それ以外の時は何もしない、という状況を考えたいと思います。

`North`の時の処理を書いて、続けて`_`というパターンを用意します。これで`North`以外の全ての列挙子、という意味になります。`switch`文における`default`のような役割を持ちます。

```rust
fn check_directon(direction: Direction) {
    match direction {
        Direction::North(distance) => {
            println!("北に{}メートル進む", distance);
            //=> 北に10メートル進む
        },
		_ => {}
        // North以外は何もしない
    }
}

fn main() {
	let direction = Direction::North(10);

	check_directon(direction);
}
```

これでも「`North`の時だけ何かしたい」という目的は達していますが、ちょっと冗長というか、`_ => {}`という部分がコードの美しさを損なっている気がします。

こういう時は`if-let`を使用しましょう。ひとまず構文は以下のようになります。

```rust
fn main() {
	let direction = Direction::West(10);

	if let Direction::North(distance) = direction {
      println!("北に{}メートル進む", distance);
      // 北に10メートル進む
	}
}
```

変数`direction`が`Direction::North(usize)`だった場合、`distance`に`10`が束縛されます。それ以外は何も起こりません。

変数`distance`のスコープは`if-let`の中にとどまります。`if-let`を抜けた先では利用することはできません（後述する`let-else`なら可能）。

```rust
fn main() {
    let direction = Direction::North(10);

    if let Direction::North(distance) = direction {
        // distanceが生きるのはここから
        println!("北に{}メートル進む", distance);
        // ここまで
    }

    // 🦀❌ エラー
    println!("{}メートル進みました", distance);
    /*
        error[E0425]: cannot find value `distance` in this scope
        --> src/main.rs:17:29
            |
         17 |     println!("{}メートル進みました", distance);
            |                                      ^^^^^^^^ not found in this scope
            |
    */
}
```

例えば、`x = 5`というパターンで`if-let`構文を使うとwarningが出ます。warning文にも`this pattern will always match`と明記されています。論駁不可能であれば`if-let`構文を使う意味がありませんからね。

```rust
fn main() {
    if let x = 10 {
    /*
        warning: irrefutable `if let` pattern
        --> src\main.rs:11:8
        |
     11 |     if let x = 10 {
        |        ^^^^^^^^^^
        |
        = note: this pattern will always match, so the `if let` is useless
        = help: consider replacing the `if let` with a `let`
        = note: `#[warn(irrefutable_let_patterns)]` on by default
    */
        println!("{}", x);
    }
}
```

### パターンマッチ


---

---

ではマッチしない可能性があるというのはどのような場合でしょうか？ズバリ、今回勉強している列挙型が当てはまります。

`let x = 5;`における`x`はあらゆるものに一致し値が束縛されるため、論駁できません（論駁不可能だといえる）。

`let x = `

つまり、パターンには論駁可能（束縛できない可能性がある）なものと論駁不可能（束縛できない可能性がない）なものがあると言えます。

そして論駁可能なものに関しては、match式を用いて全てのパターンを網羅しているわけです。

```rust
fn main() {
    let direction = Direction::North(999);

    match direction {
        Direction::West(distance) => println!("北に{}メートル進みます", distance),
        Direction::Sorth(distance) => println!("北に{}メートル進みます", distance),
        Direction::East(distance) => println!("北に{}メートル進みます", distance),
        // 🦀 Nort(999)にマッチする時
        Direction::North(999) => println!("999メートルも進んだから崖から落ちちゃいました"),
        Direction::North(distance) => println!("北に{}メートル進みます", distance),
    }
    //=> 999メートルも進んだから崖から落ちちゃいました"
}
```

非常に表現力が高いですね。

---

で、やっと`if-let`構文に戻ってきます。

列挙体の他に論駁可能なパターンに関しては、range型が挙げられます。以下の例でいうと、パターンは`1..=10`、つまり1から10までの数値ですが、当然その範囲外の数値が入ってくる可能性があるため論駁可能なパターンです。

```rust
fn main() {
    let num = 10;

    if let 1..=10 = num {
        println!("1から10の間です");
        /* 何らかの処理をする */
    }
}
```

## `let-else`

うーんこれは脳汁でますね。

## 参考

[パターンが使用されることのある箇所全部 - The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/ch18-01-all-the-places-for-patterns.html)

[Rustの「if let」とは何なのか？ - Qiita](https://qiita.com/plotter/items/0d8dc2782f21178d64f1)

[Rust Enum (With Examples)](https://www.programiz.com/rust/enum)

[Idein Ideas &#8212; Rustにおけるirrefutable patternを使ったイディオム](https://blog.idein.jp/post/644161837029605376/rust%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8Birrefutable-pattern%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E3%82%A4%E3%83%87%E3%82%A3%E3%82%AA%E3%83%A0)

[全プログラマに捧ぐ！図解「パターンマッチ」 - Qiita](https://qiita.com/hinastory/items/87431aa48197cc4d7d84)

[Rustのif let Someについて調べた話。 | ぬの部屋（仮）](https://suzulang.com/rust-if-let-some/)

[Rust - 反駁可能性: パターンが一致しない可能性があるかどうか](https://runebook.dev/ja/docs/rust/book/ch18-02-refutability)

https://maku77.github.io/p/ffqyajs/