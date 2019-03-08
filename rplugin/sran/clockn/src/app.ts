import Plugin from 'sran.nvim';
import { Subject, Subscription, from, of } from 'rxjs';
import { mergeMap, filter, catchError } from 'rxjs/operators';
import { Buffer, Window } from 'neovim';

import { fronts } from './fronts';

function align(num: string | number): string {
  return `${num}`.replace(/^(\d)$/, '0$1')
}

export class Clock {
  private flash$: Subject<any> = new Subject()
  private flashSubscription: Subscription
  private width: number
  private bufnr: number
  private winnr: number
  private buffer: Buffer
  private timer: NodeJS.Timer
  private logger: {
    info: (...args: any[]) => void
    warn: (...args: any[]) => void
    error: (...args: any[]) => void
  }

  public constructor(private plugin: Plugin) {
    this.init()
  }

  public async init() {
    const { nvim, util } = this.plugin
    this.logger = util.getLogger('clock.nvim')
    this.width = await nvim.getOption('columns') as number

    this.flashSubscription = this.flash$.pipe(
      filter(() => this.timer !== undefined),
      mergeMap(() => {
        return from(this.flash()).pipe(
          catchError(error => {
            return of(error)
          })
        )
      })
    ).subscribe(error => {
      if (error) {
        this.logger.error('Flash Error: ', error)
      }
    })

    nvim.on('notification', (method: string) => {
      switch (method) {
        case 'clockn-disable':
          this.close()
          break;
        case 'clockn-enable':
          this.enable()
          break;
        case 'clockn-flash':
          this.flash$.next(Date.now())
          break
        default:
          break;
      }
    })

    nvim.on('request', async (method: string, args: any[], resp: any) => {
      switch (method) {
        case 'clockn-disable':
          await this.close()
          resp.send()
          break;
        case 'clockn-enable':
          await this.enable()
          resp.send()
          break;
        default:
          break;
      }
    })
  }

  public async enable() {
    if (this.timer !== undefined) {
      await this.close()
    }
    const buffer = await this.createBuffer()
    this.buffer = buffer
    buffer.setOption('buftype', 'nofile')
    buffer.setOption('modifiable', false)

    const win = await this.createWin(this.bufnr)
    await win.setOption('number', false)
    await win.setOption('relativenumber', false)
    await win.setOption('cursorline', false)
    await win.setOption('cursorcolumn', false)
    await win.setOption('conceallevel', 2)
    await win.setOption('signcolumn', 'no')
    await win.setOption('winhighlight', 'Normal:ClockNormal')
    await this.updateClock()
  }

  public async close() {
    clearTimeout(this.timer)
    await this.plugin.nvim.call('clockn#close_win', this.winnr)
    this.timer = undefined
    this.buffer = undefined
  }

  public destroy() {
    this.close()
    this.flashSubscription.unsubscribe()
  }

  private async flash() {
    if (this.timer === undefined) {
      return
    }
    const { nvim } = this.plugin
    this.width = await nvim.getOption('columns') as number
    await nvim.call('nvim_win_config',[
      this.winnr,
      -1,
      -1,
      {
        relative: 'editor',
        anchor: 'NE',
        focusable: false,
        row: 1,
        col: this.width
      }
    ])
    nvim.command('mode')
  }

  private async updateClock() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.updateClock()
    }, 1000)
    await this.updateTime()
  }

  private async updateTime() {
    const { nvim } = this.plugin
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
    this.buffer && await this.buffer.setOption('modifiable', true)
    const eventignore = await nvim.getOption('eventignore') as string
    await nvim.setOption('eventignore', 'all')
    this.buffer && await this.buffer.replace(lines, 0)
    await nvim.setOption('eventignore', eventignore)
    this.buffer && await this.buffer.setOption('modifiable', false)
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
