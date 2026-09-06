// 视图：组织架构
import { esc } from '../utils/dom.js?v=6.15';

export async function render(workspace = document.getElementById('workspace')) {
  workspace.innerHTML = `
    <div class="page-frame space-y-4">
      <div class="rounded-lg border border-slate-200 bg-white p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">account_tree</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-slate-900">组织架构</h2>
            <p class="text-sm text-slate-500 mt-1">企业组织架构与部门管理</p>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center py-20 text-center">
          <div class="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-4xl text-slate-400">construction</span>
          </div>
          <h3 class="text-lg font-semibold text-slate-700">未完待续</h3>
          <p class="text-sm text-slate-500 mt-2 max-w-md">
            组织架构模块正在建设中，敬请期待。<br/>
            后续将支持部门管理、人员架构、权限分配等功能。
          </p>
        </div>
      </div>
    </div>
  `;
}
