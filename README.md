# Everyday One Motion - logo "Everyday One Motion"

![](http://motions.work/img/FMS_Cat_5683d70496106.gif)

## js

前半をJSによるRaymarcherで描画  
テクスチャ、メタボール、スラッシュパターン、文字レイマーチ…  

## p5

後半をP5で描画  
字がせり上がってくる箇所と落ちる箇所  

## sh

どれもnode.jsとImageMagickの合わせ技  

### blur.js

連番画像を10枚ずつ平均とるスクリプト  
モーションブラーの生成のため  
js, p5とも実際の速度の10倍のフレーム数を生成している  

### blend.js

２画像間をクロスフェードするスクリプト  
jsとp5のEOM縦並び画像をクロスフェードでごまかすため  

### merge.js

連番画像同士を比較明合成するスクリプト  
blend.jsでごまかした画像とp5の"E","O","M"がせり上がってくるところを合成するため  

### reduce.js

画像を縮小するスクリプト  
最終的にGIFのファイルサイズが大きすぎになってしまったため  
