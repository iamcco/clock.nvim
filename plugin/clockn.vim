scriptencoding utf-8

if exists('g:loaded_clockn')
    finish
endif

let g:loaded_clockn = 1

let s:save_cpo = &cpo
set cpo&vim

if exists('g:clockn_color')
  execute "highlight ClockNormal guifg=" . g:clockn_color
else
  highlight default link ClockNormal Normal
endif

if !exists('g:clockn_to_top')
  let g:clockn_to_top = 1
endif

if !exists('g:clockn_to_right')
  let g:clockn_to_right = 1
endif

function! s:init() abort
  command! ClockDisable call clockn#disable()
  command! ClockEnable call clockn#enable()
  if get(g:, 'clockn_enable', 0) ==# 1
    call clockn#enable()
  endif
endfunction

autocmd User SranNvimRpcReady call s:init()

let s:save_cpo = &cpo
set cpo&vim
