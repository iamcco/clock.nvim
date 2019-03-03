import Plugin from 'sran.nvim';

import { Clock } from './app';

export default async function(plugin: Plugin) {
  new Clock(plugin)
}
