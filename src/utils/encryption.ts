import CryptoJS from 'crypto-js'

// 加密密钥（在实际应用中应该更安全地管理）
const ENCRYPTION_KEY = 'gold-digger-logical-secret-key-2024'

/**
 * 加密数据
 */
export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data)
    return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
  } catch (error) {
    console.error('加密数据失败:', error)
    throw new Error('数据加密失败')
  }
}

/**
 * 解密数据
 */
export const decryptData = <T>(encryptedData: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    
    if (!decryptedString) {
      console.error('解密失败: 无效的加密数据')
      return null
    }
    
    return JSON.parse(decryptedString) as T
  } catch (error) {
    console.error('解密数据失败:', error)
    return null
  }
}

/**
 * 生成设备指纹（用于限制测试次数）
 */
export const generateDeviceFingerprint = (): string => {
  const fingerprintData = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: Date.now()
  }
  
  const fingerprintString = JSON.stringify(fingerprintData)
  return CryptoJS.SHA256(fingerprintString).toString()
}

/**
 * 检查设备是否已超过测试限制
 */
export const checkDeviceLimit = (): boolean => {
  const deviceFingerprint = generateDeviceFingerprint()
  const storageKey = `device_limit_${deviceFingerprint}`
  
  const storedData = localStorage.getItem(storageKey)
  if (!storedData) {
    // 首次使用，设置限制
    const limitData = {
      testCount: 1,
      firstTestTime: Date.now(),
      lastTestTime: Date.now()
    }
    localStorage.setItem(storageKey, encryptData(limitData))
    return false
  }
  
  const decryptedData = decryptData<{
    testCount: number
    firstTestTime: number
    lastTestTime: number
  }>(storedData)
  
  if (!decryptedData) {
    return false
  }
  
  // 检查24小时内测试次数限制（例如最多3次）
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000)
  const isWithin24Hours = decryptedData.lastTestTime > twentyFourHoursAgo
  
  if (isWithin24Hours && decryptedData.testCount >= 3) {
    return true // 超过限制
  }
  
  // 更新测试记录
  const updatedData = {
    testCount: isWithin24Hours ? decryptedData.testCount + 1 : 1,
    firstTestTime: isWithin24Hours ? decryptedData.firstTestTime : Date.now(),
    lastTestTime: Date.now()
  }
  
  localStorage.setItem(storageKey, encryptData(updatedData))
  return false
}

/**
 * 安全存储测试报告
 */
export const saveSecureReport = (report: any): void => {
  try {
    const reportsKey = 'secure_test_reports'
    const existingReports = localStorage.getItem(reportsKey)
    
    let reports: any[] = []
    if (existingReports) {
      const decrypted = decryptData<any[]>(existingReports)
      if (decrypted) {
        reports = decrypted
      }
    }
    
    // 添加新报告
    reports.unshift({
      ...report,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      encrypted: true
    })
    
    // 只保留最近10份报告
    if (reports.length > 10) {
      reports = reports.slice(0, 10)
    }
    
    localStorage.setItem(reportsKey, encryptData(reports))
  } catch (error) {
    console.error('保存加密报告失败:', error)
  }
}

/**
 * 获取安全存储的测试报告
 */
export const getSecureReports = (): any[] => {
  try {
    const reportsKey = 'secure_test_reports'
    const encryptedReports = localStorage.getItem(reportsKey)
    
    if (!encryptedReports) {
      return []
    }
    
    const reports = decryptData<any[]>(encryptedReports)
    return reports || []
  } catch (error) {
    console.error('获取加密报告失败:', error)
    return []
  }
}

/**
 * 删除指定的测试报告
 */
export const deleteSecureReport = (reportId: string): void => {
  try {
    const reports = getSecureReports()
    const filteredReports = reports.filter(report => report.id !== reportId)
    
    const reportsKey = 'secure_test_reports'
    localStorage.setItem(reportsKey, encryptData(filteredReports))
  } catch (error) {
    console.error('删除加密报告失败:', error)
  }
}

/**
 * 清除所有本地存储数据
 */
export const clearAllSecureData = (): void => {
  try {
    // 清除报告数据
    localStorage.removeItem('secure_test_reports')
    
    // 清除设备限制数据
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('device_limit_')) {
        localStorage.removeItem(key)
      }
    })
    
    // 清除其他可能的安全数据
    localStorage.removeItem('test_code_validation')
    localStorage.removeItem('current_test_data')
  } catch (error) {
    console.error('清除安全数据失败:', error)
  }
}