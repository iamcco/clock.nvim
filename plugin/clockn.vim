function! s:init() abort
  command! ClockDisable call sran#rpc#notify('clockn-disable')
  command! ClockEnable call sran#rpc#notify('clockn-enable')
endfunction

autocmd User SranNvimRpcReady call s:init()
