'use strict'; //厳格モード
window.onload = () => {
  /***DOMの取得***/
  const result = document.getElementById('result');
  //属性セレクタを使って3つのスライダを取得
  const params = document.querySelectorAll('[type="range"]');
  const code = document.getElementById('code');
  const check = document.getElementById('check');
  for (let i = 0; i < params.length; i++) {
    //inputイベントは入力フォームに変化があるたびにイベントが走る
    //(changeは値確定時にはしる)
    params[i].addEventListener('input', () => {
      //３つのスライダの値をintに変化して配列に格納
      const rgb = [
        parseInt(params[0].value),
        parseInt(params[1].value),
        parseInt(params[2].value),
      ];
      //配列から文字コードの文字列に変換(下部に変換関数あり)
      const cCode = toHex(rgb);
      //rgb情報とカラーコード文字列でサイトの見た目を変更する(下部に関数あり)
      setColor(rgb, cCode);
      //兄弟要素のうち次の要素を取得し、その内容をスライダの値にする
      //(参考:前の要素はpreviousElementSibling)
      params[i].nextElementSibling.textContent = params[i].value;
      //下部にあるフォームの内容を現在の値で書き換える
      //substring(1)とすると最初の一文字(#)を削除することができる
      code.value = cCode.substring(1);
    });
  }

  /***チェックボタンが押されたときの挙動***/
  check.addEventListener('click', () => {
    //入力された値からカラーコードを作成
    const cCode = '#' + code.value;
    //16進数で記述されたコードからrgb成分の配列を作成(下部に関数あり)
    const rgb = toRGB(code.value);
    //入力されたコードが不正だった場合
    if (rgb === null) {
      code.value = 'invalid code!!';
      return;
    }
    //サイトの見た目を更新(下部に関数)
    setColor(rgb, cCode);
    //3つのスライダの値をrgbの値にそれぞれセットする
    for (let i = 0; i < params.length; i++) {
      params[i].value = rgb[i];
      params[i].nextElementSibling.textContent = rgb[i];
    }
  });
  /***rgb要素の配列からカラーコードを作成する関数***/
  const toHex = (rgb) => {
    let cCode = '#';
    for (let dec of rgb) {
      //10進数から16進数の文字列に変換
      let hex = dec.toString(16);
      if (dec < 16) {
        //1桁の場合は0埋め
        hex = '0' + hex;
      }
      cCode += hex;
    }
    //作成された#xxxxxxというカラーコードを返却
    return cCode;
  };
  /***フォームから入力されたカラーコードからrgb成分の配列を作成する関数 */
  const toRGB = (code) => {
    //正規表現を使って[0-9a-fA-F]以外の文字を使っていたり、3文字、または6文字でなければ不正
    if (!/^([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(code)) {
      //不正だった場合nullを返却
      return null;
    }
    //3文字のカラーコードだった場合6文字に変換
    if (code.length === 3) {
      code =
        code.charAt(0) +
        code.charAt(0) +
        code.charAt(1) +
        code.charAt(1) +
        code.charAt(2) +
        code.charAt(2);
    }
    //文字列の中から各成分を 16進数の文字列として切り出して
    //それを10進数に変換
    let r = parseInt(code.substring(0, 2), 16);
    let g = parseInt(code.substring(2, 4), 16);
    let b = parseInt(code.substring(4, 6), 16);
    //配列にして返却
    return [r, g, b];
  };
   /****viewを更新する関数****/
  const setColor = (rgb, cCode) => {
    //色味が暗かったら文字色を白に、明るかったら黒にする
    if (rgb[0] + rgb[1] + rgb[2] < 380) {
      result.style.color = 'white';
    } else {
      result.style.color = 'black';
    }
    //背景色をカラーコードに設定
    result.style.backgroundColor = cCode;
    //文字コードを小文字にして表示
    result.textContent = cCode.toLowerCase();
  };
};
