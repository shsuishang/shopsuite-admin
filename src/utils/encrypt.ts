import JSEncrypt from 'jsencrypt'
import { getPublicKey } from '@/api/publicKey'

const privateKey =
  'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMFPa+v52FkSUXvcUnrGI/XzW3EpZRI0s9BCWJ3oNQmEYA5luWW5p8h0uadTIoTyYweFPdH4hveyxlwmS7oefvbIdiP+o+QIYW/R4Wjsb4Yl8MhR4PJqUE3RCy6IT9fM8ckG4kN9ECs6Ja8fQFc6/mSl5dJczzJO3k1rWMBhKJD/AgMBAAECgYEAucMakH9dWeryhrYoRHcXo4giPVJsH9ypVt4KzmOQY/7jV7KFQK3x//27UoHfUCak51sxFw9ek7UmTPM4HjikA9LkYeE7S381b4QRvFuf3L6IbMP3ywJnJ8pPr2l5SqQ00W+oKv+w/VmEsyUHr+k4Z+4ik+FheTkVWp566WbqFsECQQDjYaMcaKw3j2Zecl8T6eUe7fdaRMIzp/gcpPMfT/9rDzIQk+7ORvm1NI9AUmFv/FAlfpuAMrdL2n7p9uznWb7RAkEA2aP934kbXg5bdV0R313MrL+7WTK/qdcYxATUbMsMuWWQBoS5irrt80WCZbG48hpocJavLNjbtrjmUX3CuJBmzwJAOJg8uP10n/+ZQzjEYXh+BszEHDuw+pp8LuT/fnOy5zrJA0dO0RjpXijO3vuiNPVgHXT9z1LQPJkNrb5ACPVVgQJBALPeb4uV0bNrJDUb5RB4ghZnIxv18CcaqNIft7vuGCcFBAIPIRTBprR+RuVq+xHDt3sNXdsvom4h49+Hky1b0ksCQBBwUtVaqH6ztCtwUF1j2c/Zcrt5P/uN7IHAd44K0gIJc1+Csr3qPG+G2yoqRM8KVqLI8Z2ZYn9c+AvEE+L9OQY='

/**
 * @description RSA加密(支持长字符加密)
 * @param data
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export async function encryptedData(data: string) {
  let publicKey
  const res = await getPublicKey()
  publicKey = res.data.public_key

  if (res.data.mock_server) {
    publicKey = ''
  }

  if (publicKey === '') {
    return data
  }

  const encrypt = new JSEncrypt()

  encrypt.setPublicKey(
    `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  )

  return encrypt.encrypt(data);  // 返回加密后的一串字符串
}

/**
 * @description RSA解密(支持长字符解密)
 * @param data
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function decryptedData(data: string) {
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(
    `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
  )

  return decrypt.decrypt(data);  // 返回解密后的数据
}
