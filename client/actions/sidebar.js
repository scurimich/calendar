import { ACTIVE_SIDEBAR_INFO } from '../constants/actions.js';

export function changeSidebarContent(content) {
  return { type: ACTIVE_SIDEBAR_INFO, content: content };
}
