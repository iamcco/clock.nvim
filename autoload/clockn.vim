scriptencoding utf-8

let s:is_temp_close = v:false

function! clockn#close_win(id) abort
  let winnr = win_id2win(a:id)
  if winnr > 0
    execute winnr.'wincmd c'
    return 1
  endif
  return 0
endfunction

function! clockn#delete_auto() abort
  try
    autocmd! ClockN
    augroup! ClockN
  catch /.*/
  endtry
endfunction

function! clockn#init_auto() abort
  augroup ClockN
    autocmd!
    autocmd TabLeave * call clockn#close_temp()
    autocmd TabEnter * call clockn#open_temp()
    autocmd VimResized * call sran#rpc#notify('clockn-flash')
    autocmd QuitPre * call sran#rpc#request('clockn-disable')
  augroup END
endfunction

function! clockn#close_temp() abort
  let s:is_temp_close = v:true
  call sran#rpc#request('clockn-disable')
endfunction

function! clockn#open_temp() abort
  if s:is_temp_close ==# v:true
    let s:is_temp_close = v:false
    call sran#rpc#notify('clockn-enable')
  endif
endfunction

function! clockn#disable() abort
  call clockn#delete_auto()
  call sran#rpc#notify('clockn-disable')
endfunction

function! clockn#enable() abort
  call sran#rpc#notify('clockn-enable')
  call clockn#init_auto()
endfunction
