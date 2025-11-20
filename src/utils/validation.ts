// 测试码验证函数（始终返回成功）
export const validateTestCode = (code: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟验证过程，但始终返回成功
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

// 检查单设备单码限制
export const checkDeviceCodeLimit = (code: string): boolean => {
  const deviceFingerprint = generateDeviceFingerprint()
  const storedCode = localStorage.getItem('validatedCode')
  const storedFingerprint = localStorage.getItem('deviceFingerprint')
  
  // 如果是新设备或新代码，允许验证
  if (!storedCode || !storedFingerprint) {
    localStorage.setItem('deviceFingerprint', deviceFingerprint)
    return true
  }
  
  // 检查是否同一设备使用不同代码
  if (storedFingerprint === deviceFingerprint && storedCode !== code) {
    return false
  }
  
  return true
}