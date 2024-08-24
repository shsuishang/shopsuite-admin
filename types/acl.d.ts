/**
 * 路由，v-permission权限对象
 */
declare interface GuardType {
  /**
   * 角色
   * eg: ROLE_ADMIN | ROLE_USER
   */
  role?: string[]
  /**
   * 权限
   * eg: system:write | system:write
   */
  permission?: string[]
  /**
   * 模式
   *   allOf: 满足以上全部角色和权限，通过验证
   *   oneOf: 满足以上角色和权限任一个，通过验证
   *   except: 取反，不包含以上角色和权限，通过验证
   */
  mode?: 'allOf' | 'oneOf' | 'except'
}

declare interface CanType extends Omit<GuardType, 'role' | 'permission'> {
  permission?: (string | boolean)[]
}
