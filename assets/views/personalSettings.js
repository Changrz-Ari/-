// 视图：个人设置
import { esc, toast } from '../utils/dom.js?v=6.15';

// 获取当前用户信息
function getCurrentUser() {
  const account = localStorage.getItem('cscec_account') || '';
  const users = JSON.parse(localStorage.getItem('cscec_users') || '{}');
  return users[account] || { account, phone: '', email: '', password: '', createdAt: '', lastLogin: '' };
}

// 保存用户信息
function saveUser(account, data) {
  const users = JSON.parse(localStorage.getItem('cscec_users') || '{}');
  users[account] = { ...users[account], ...data };
  localStorage.setItem('cscec_users', JSON.stringify(users));
}

export async function render(workspace = document.getElementById('workspace')) {
  const user = getCurrentUser();
  const account = localStorage.getItem('cscec_account') || '';

  workspace.innerHTML = `
    <div class="page-frame space-y-4">
      <!-- 个人信息 -->
      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">person</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-slate-900">个人设置</h2>
            <p class="text-sm text-slate-500 mt-1">管理您的账号信息与密码</p>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-6">
          <!-- 账号信息 -->
          <div class="col-span-12 lg:col-span-6 space-y-4">
            <h3 class="text-base font-semibold text-slate-800 border-b border-slate-200 pb-2">账号信息</h3>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">登录账号</label>
              <input type="text" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-slate-50" value="${esc(account)}" disabled />
              <p class="text-xs text-slate-400 mt-1">登录账号不可修改</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">手机号</label>
              <input type="tel" id="userPhone" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${esc(user.phone || '')}" placeholder="请输入手机号" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">邮箱</label>
              <input type="email" id="userEmail" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${esc(user.email || '')}" placeholder="请输入邮箱" />
            </div>

            <button id="saveProfileBtn" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">保存个人信息</button>
          </div>

          <!-- 修改密码 -->
          <div class="col-span-12 lg:col-span-6 space-y-4">
            <h3 class="text-base font-semibold text-slate-800 border-b border-slate-200 pb-2">修改密码</h3>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">当前密码</label>
              <input type="password" id="oldPassword" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入当前密码" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">新密码</label>
              <input type="password" id="newPassword" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入新密码（至少6位）" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">确认新密码</label>
              <input type="password" id="confirmPassword" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请再次输入新密码" />
            </div>

            <button id="changePasswordBtn" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">修改密码</button>
          </div>
        </div>
      </div>

      <!-- 登录记录 -->
      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <h3 class="text-base font-semibold text-slate-800 mb-4">账号信息</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-slate-50 rounded-lg">
            <div class="text-xs text-slate-500">注册时间</div>
            <div class="text-sm font-medium text-slate-800 mt-1">${esc(user.createdAt || '-')}</div>
          </div>
          <div class="p-4 bg-slate-50 rounded-lg">
            <div class="text-xs text-slate-500">最后登录</div>
            <div class="text-sm font-medium text-slate-800 mt-1">${esc(user.lastLogin || '-')}</div>
          </div>
          <div class="p-4 bg-slate-50 rounded-lg">
            <div class="text-xs text-slate-500">账号角色</div>
            <div class="text-sm font-medium text-blue-600 mt-1">${localStorage.getItem('cscec_role') === 'admin' ? '管理员' : '普通用户'}</div>
          </div>
          <div class="p-4 bg-slate-50 rounded-lg">
            <div class="text-xs text-slate-500">账号状态</div>
            <div class="text-sm font-medium text-green-600 mt-1">正常</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // 保存个人信息
  document.getElementById('saveProfileBtn').onclick = () => {
    const phone = document.getElementById('userPhone').value.trim();
    const email = document.getElementById('userEmail').value.trim();

    if (phone && !/^1\d{10}$/.test(phone)) {
      toast('请输入正确的手机号', 'error');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast('请输入正确的邮箱', 'error');
      return;
    }

    saveUser(account, { phone, email });
    toast('个人信息已保存', 'success');
  };

  // 修改密码
  document.getElementById('changePasswordBtn').onclick = () => {
    const oldPwd = document.getElementById('oldPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;

    if (!oldPwd) { toast('请输入当前密码', 'error'); return; }
    if (!newPwd) { toast('请输入新密码', 'error'); return; }
    if (newPwd.length < 6) { toast('新密码至少6位', 'error'); return; }
    if (newPwd !== confirmPwd) { toast('两次输入的新密码不一致', 'error'); return; }

    const currentUser = getCurrentUser();
    if (currentUser.password && currentUser.password !== oldPwd) {
      toast('当前密码错误', 'error');
      return;
    }

    saveUser(account, { password: newPwd });
    toast('密码修改成功', 'success');
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  };
}
