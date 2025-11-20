// 测试码验证函数
export const validateTestCode = (code: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 验证条件1: 长度必须为8位
      if (code.length !== 8) {
        reject(new Error('测试码不存在，请联系客服！'))
        return
      }
      
      // 验证条件2: 至少包含一个大写字母、一个小写字母、一个数字
      const hasUpperCase = /[A-Z]/.test(code)
      const hasLowerCase = /[a-z]/.test(code)
      const hasNumber = /[0-9]/.test(code)
      
      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        reject(new Error('测试码不存在，请联系客服！'))
        return
      }
      
      // 验证通过，保存测试码
      localStorage.setItem('validatedCode', code)
      resolve(true)
    }, 1000) // 1秒延迟模拟网络请求
  })
}

// 检查测试码是否已验证
export const isTestCodeValidated = (): boolean => {
  return !!localStorage.getItem('validatedCode')
}

// 清除测试码验证状态
export const clearTestCodeValidation = (): void => {
  localStorage.removeItem('validatedCode')
}

// 生成设备指纹（简化版）
export const generateDeviceFingerprint = (): string => {
  const navigatorInfo = navigator.userAgent + navigator.language
  const screenInfo = screen.width + 'x' + screen.height
  return btoa(navigatorInfo + screenInfo).substring(0, 16)
}