# A Big Clock For Neovim

> only support neovim with floating window feature

![screenshot](https://user-images.githubusercontent.com/5492542/53694533-3d813e80-3deb-11e9-98a7-1fd9f58b0ba4.png)

## Install

use vim-plug:

```vim
Plug 'iamcco/sran.nvim', { 'do': { -> sran#util#install() } }
Plug 'iamcco/clock.nvim'
```

## Usage & Config

```vim
" auto enable when neovim start
let g:clockn_enable = 1

" config the clock's color
let g:clockn_color = '#000000'

" config opacity of floating window background
" 0-100 from fully opaque to transparent
" default is 100
let g:clockn_winblend = 100

" or use the ClockNormal highlight group
highlight ClockNormal guifg=#000000

" position distance to top and right
let g:clockn_to_top = 1
let g:clockn_to_right = 1

" enable clock
:ClockEnable

" disable clock
:ClockDisable
```

### Buy Me A Coffee ☕️

![btc](https://img.shields.io/keybase/btc/iamcco.svg?style=popout-square)

![image](https://user-images.githubusercontent.com/5492542/42771079-962216b0-8958-11e8-81c0-520363ce1059.png)
