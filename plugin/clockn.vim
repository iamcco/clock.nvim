scriptencoding utf-8

if exists('g:loaded_clockn')
    finish
endif

let g:loaded_clockn = 1

let s:save_cpo = &cpo
set cpo&vim

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
