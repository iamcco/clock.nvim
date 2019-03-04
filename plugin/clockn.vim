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
    augroup ClockN
      autocmd!
      "autocmd TabLeave * call sran#rpc#request('clockn-disable')
      "autocmd TabEnter * call sran#rpc#notify('clockn-enable')
      "autocmd VimResized * call sran#rpc#notify('clockn-flash')
      "autocmd VimLeave,VimLeavePre,WinLeave * call sran#rpc#request('clockn-disable')
    augroup END
  endif
endfunction

autocmd User SranNvimRpcReady call s:init()

let s:save_cpo = &cpo
set cpo&vim
