import Plugin from 'sran.nvim';
import { Buffer, Window } from 'neovim';

import { fronts } from './fronts';

function align(num: string | number): string {
  return `${num}`.replace(/^(\d)$/, '0$1')
}

export class Clock {
  private width: number
  private bufnr: number
  private winnr: number
  private buffer: Buffer
  private timer: NodeJS.Timer

  public constructor(private plugin: Plugin) {
    this.init()
  }

  public async init() {
    const { nvim } = this.plugin
    const isEnable = await nvim.getVar('clockn_enable')
    this.width = await nvim.call('winwidth', 0)

    nvim.on('notification', (method: string) => {
      if (method === 'clockn-disable') {
        this.close()
      } else if (method === 'clockn-enable') {
        this.enable()
      }
    })

    if (isEnable) {
      this.enable()
    }
  }

  public async enable() {
    if (this.timer !== undefined) {
      return
    }
    const buffer = await this.createBuffer()
    this.buffer = buffer
    buffer.setOption('buftype', 'nofile')
    buffer.setOption('modifiable', false)

    const win = await this.createWin(this.bufnr)
    win.setOption('number', false)
    win.setOption('relativenumber', false)
    win.setOption('cursorline', false)
    win.setOption('cursorcolumn', false)
    win.setOption('conceallevel', 2)
    win.setOption('signcolumn', 'no')
    this.updateClock()
  }

  public close() {
    clearTimeout(this.timer)
    this.plugin.nvim.call('clockn#close_win', this.winnr)
    this.timer = undefined
    this.buffer = undefined
  }

  private updateClock() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.updateClock()
    }, 1000)
    this.updateTime()
  }

  private async updateTime() {
    const now = new Date()
    const hours = align(now.getHours())
    const minutes = align(now.getMinutes())
    const seconds = align(now.getSeconds())
    const lines = fronts[hours[0]]
      .map((item: string[], idx: number) => {
        const hour = `${item.join('')}${fronts[hours[1]][idx].join('')}`
        const separator = fronts['separator'][idx].join('')
        const minute = `${fronts[minutes[0]][idx].join('')}${fronts[minutes[1]][idx].join('')}`
        const second = `${fronts[seconds[0]][idx].join('')}${fronts[seconds[1]][idx].join('')}`
        return `${hour}${separator}${minute}${separator}${second}`.trimRight()
      })
    await this.buffer.setOption('modifiable', true)
    await this.buffer.replace(lines, 0)
    await this.buffer.setOption('modifiable', false)
  }

  private async createBuffer() {
    const { nvim } = this.plugin
    let buffer: Buffer
    this.bufnr = await nvim.call('nvim_create_buf', [0, 1])
    const buffers = await nvim.buffers
    buffers.some(b => {
      if (this.bufnr === b.id) {
        buffer = b
        return true;
      }
      return false;
    })
    return buffer
  }

  private async createWin(bufnr: number) {
    const { nvim } = this.plugin
    this.winnr = await nvim.call(
      'nvim_open_win',
      [
        bufnr,
        false,
        54,
        5,
        {
          relative: 'editor',
          anchor: 'NE',
          focusable: false,
          row: 1,
          col: this.width
        }
      ]
    )
    let win: Window
    const windows = await nvim.windows
    windows.some(w => {
      if (w.id === this.winnr) {
        win = w
        return true
      }
      return false
    })
    return win
  }
}
