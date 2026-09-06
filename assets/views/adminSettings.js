// 视图：管理员设置
import { esc, toast, openModal } from '../utils/dom.js?v=6.15';

// 获取所有用户
function getAllUsers() {
  return JSON.parse(localStorage.getItem('cscec_users') || '{}');
}

// 获取操作日志
function getOperationLogs() {
  return JSON.parse(localStorage.getItem('cscec_operation_logs') || '[]');
}

// 记录操作日志
export function logOperation(account, action, detail = '') {
  const logs = getOperationLogs();
  logs.unshift({
    id: Date.now(),
    account,
    action,
    detail,
    timestamp: new Date().toLocaleString('zh-CN'),
  });
  // 最多保留500条
  if (logs.length > 500) logs.length = 500;
  localStorage.setItem('cscec_operation_logs', JSON.stringify(logs));
}

export async function render(workspace = document.getElementById('workspace')) {
  const isAdmin = localStorage.getItem('cscec_role') === 'admin';
  const users = getAllUsers();
  const logs = getOperationLogs();
  const userList = Object.entries(users).map(([account, data]) => ({ account, ...data }));

  if (!isAdmin) {
    workspace.innerHTML = `
      <div class="page-frame">
        <div class="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <span class="material-symbols-outlined text-4xl text-red-500">block</span>
          <h3 class="mt-3 text-lg font-semibold text-red-700">权限不足</h3>
          <p class="mt-2 text-sm text-red-600">您不是系统管理员，无法访问此页面。</p>
        </div>
      </div>
    `;
    return;
  }

  workspace.innerHTML = `
    <div class="page-frame space-y-4">
      <!-- 管理员信息概览 -->
      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="h-12 w-12 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-slate-900">管理员系统</h2>
            <p class="text-sm text-slate-500 mt-1">用户管理、操作日志、系统监控</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="text-xs text-blue-600">注册用户数</div>
            <div class="text-2xl font-bold text-blue-700 mt-1">${userList.length}</div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <div class="text-xs text-green-600">今日操作</div>
            <div class="text-2xl font-bold text-green-700 mt-1">${logs.filter(l => l.timestamp.includes(new Date().toLocaleDateString('zh-CN'))).length}</div>
          </div>
          <div class="p-4 bg-amber-50 rounded-lg">
            <div class="text-xs text-amber-600">操作日志总数</div>
            <div class="text-2xl font-bold text-amber-700 mt-1">${logs.length}</div>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <div class="text-xs text-purple-600">管理员账号</div>
            <div class="text-2xl font-bold text-purple-700 mt-1">${userList.filter(u => u.role === 'admin').length}</div>
          </div>
        </div>
      </div>

      <!-- 用户管理 -->
      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-slate-800">用户管理</h3>
          <button id="exportUsersBtn" class="px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition">导出用户列表</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-left text-slate-500">
                <th class="pb-3 pr-4 font-medium">账号</th>
                <th class="pb-3 pr-4 font-medium">密码</th>
                <th class="pb-3 pr-4 font-medium">手机号</th>
                <th class="pb-3 pr-4 font-medium">邮箱</th>
                <th class="pb-3 pr-4 font-medium">角色</th>
                <th class="pb-3 pr-4 font-medium">注册时间</th>
                <th class="pb-3 pr-4 font-medium">最后登录</th>
                <th class="pb-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              ${userList.length ? userList.map(user => `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                  <td class="py-3 pr-4 font-medium text-slate-800">${esc(user.account)}</td>
                  <td class="py-3 pr-4 text-slate-600 font-mono text-xs">${esc(user.password || '-')}</td>
                  <td class="py-3 pr-4 text-slate-600">${esc(user.phone || '-')}</td>
                  <td class="py-3 pr-4 text-slate-600">${esc(user.email || '-')}</td>
                  <td class="py-3 pr-4">
                    <span class="px-2 py-0.5 rounded text-xs ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}">${user.role === 'admin' ? '管理员' : '普通用户'}</span>
                  </td>
                  <td class="py-3 pr-4 text-slate-500 text-xs">${esc(user.createdAt || '-')}</td>
                  <td class="py-3 pr-4 text-slate-500 text-xs">${esc(user.lastLogin || '-')}</td>
                  <td class="py-3">
                    <button class="text-blue-600 hover:text-blue-800 text-xs mr-3" data-reset-pwd="${esc(user.account)}">重置密码</button>
                    ${user.role !== 'admin' ? `<button class="text-red-600 hover:text-red-800 text-xs" data-delete-user="${esc(user.account)}">删除</button>` : ''}
                  </td>
                </tr>
              `).join('') : `
                <tr><td colspan="8" class="py-8 text-center text-slate-400">暂无用户数据</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 操作日志 -->
      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-slate-800">操作日志</h3>
          <div class="flex gap-2">
            <button id="clearLogsBtn" class="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition">清空日志</button>
            <button id="exportLogsBtn" class="px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition">导出日志</button>
          </div>
        </div>
        <div class="overflow-x-auto max-h-96 overflow-y-auto">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-white">
              <tr class="border-b border-slate-200 text-left text-slate-500">
                <th class="pb-3 pr-4 font-medium">时间</th>
                <th class="pb-3 pr-4 font-medium">账号</th>
                <th class="pb-3 pr-4 font-medium">操作</th>
                <th class="pb-3 font-medium">详情</th>
              </tr>
            </thead>
            <tbody>
              ${logs.length ? logs.slice(0, 100).map(log => `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                  <td class="py-2.5 pr-4 text-slate-500 text-xs whitespace-nowrap">${esc(log.timestamp)}</td>
                  <td class="py-2.5 pr-4 font-medium text-slate-700">${esc(log.account)}</td>
                  <td class="py-2.5 pr-4 text-slate-600">${esc(log.action)}</td>
                  <td class="py-2.5 text-slate-500 text-xs">${esc(log.detail || '-')}</td>
                </tr>
              `).join('') : `
                <tr><td colspan="4" class="py-8 text-center text-slate-400">暂无操作日志</td></tr>
              `}
            </tbody>
          </table>
        </div>
        ${logs.length > 100 ? `<p class="text-xs text-slate-400 mt-3">仅显示最近100条，共${logs.length}条</p>` : ''}
      </div>
    </div>
  `;

  // 重置密码
  document.querySelectorAll('[data-reset-pwd]').forEach(btn => {
    btn.onclick = () => {
      const account = btn.dataset.resetPwd;
      const newPwd = prompt(`请输入账号 "${account}" 的新密码：`, '123456');
      if (newPwd === null) return;
      if (newPwd.length < 6) { toast('密码至少6位', 'error'); return; }
      const users = getAllUsers();
      if (users[account]) {
        users[account].password = newPwd;
        localStorage.setItem('cscec_users', JSON.stringify(users));
        logOperation(localStorage.getItem('cscec_account') || 'admin', '重置密码', `重置账号 ${account} 的密码`);
        toast(`账号 ${account} 密码已重置为 ${newPwd}`, 'success');
        render();
      }
    };
  });

  // 删除用户
  document.querySelectorAll('[data-delete-user]').forEach(btn => {
    btn.onclick = () => {
      const account = btn.dataset.deleteUser;
      if (!confirm(`确定要删除账号 "${account}" 吗？此操作不可恢复。`)) return;
      const users = getAllUsers();
      delete users[account];
      localStorage.setItem('cscec_users', JSON.stringify(users));
      logOperation(localStorage.getItem('cscec_account') || 'admin', '删除用户', `删除账号 ${account}`);
      toast(`账号 ${account} 已删除`, 'success');
      render();
    };
  });

  // 导出用户列表
  document.getElementById('exportUsersBtn').onclick = () => {
    const users = getAllUsers();
    const csv = '账号,密码,手机号,邮箱,角色,注册时间,最后登录\n' +
      Object.entries(users).map(([account, data]) =>
        `${account},${data.password || ''},${data.phone || ''},${data.email || ''},${data.role || '普通用户'},${data.createdAt || ''},${data.lastLogin || ''}`
      ).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `用户列表_${new Date().toLocaleDateString('zh-CN')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logOperation(localStorage.getItem('cscec_account') || 'admin', '导出用户列表', '');
    toast('用户列表已导出', 'success');
  };

  // 清空日志
  document.getElementById('clearLogsBtn').onclick = () => {
    if (!confirm('确定要清空所有操作日志吗？此操作不可恢复。')) return;
    localStorage.setItem('cscec_operation_logs', '[]');
    logOperation(localStorage.getItem('cscec_account') || 'admin', '清空操作日志', '');
    toast('操作日志已清空', 'success');
    render();
  };

  // 导出日志
  document.getElementById('exportLogsBtn').onclick = () => {
    const logs = getOperationLogs();
    const csv = '时间,账号,操作,详情\n' +
      logs.map(log => `${log.timestamp},${log.account},${log.action},${log.detail || ''}`).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `操作日志_${new Date().toLocaleDateString('zh-CN')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('操作日志已导出', 'success');
  };
}
