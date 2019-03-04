scriptencoding utf-8

function! clockn#close_win(id) abort
  let winnr = win_id2win(a:id)
  if winnr > 0
    execute winnr.'wincmd c'
    return 1
  endif
  return 0
endfunction

function! clockn#enable() abort
  call sran#rpc#notify('clockn-enable')
  augroup ClockN
    autocmd!
    "autocmd TabLeave * call sran#rpc#request('clockn-disable')
    "autocmd TabEnter * call sran#rpc#notify('clockn-enable')
    "autocmd TabEnter,VimResized * call sran#rpc#notify('clockn-flash')
    "autocmd VimLeave,VimLeavePre * call sran#rpc#request('clockn-disable')
  augroup END
endfunction

function! clockn#disable() abort
  autocmd! ClockN
  augroup! ClockN
  call sran#rpc#notify('clockn-disable')
endfunction
