
const defaultStrategy = {
  lazy: true, // 懒校验，只要有一个字段校验不通过则立即返回结果
  strict: true // 严格模式，若目标字段不存在，依旧进行校验
}

class Validator {
  constructor(options, strategy) {
    this._stack = []
    this._strategy = this._mergeStrategy(strategy)
    if (Object.prototype.toString.call(options) === '[object Array]') {
      options.forEach(chain => {
        if (!chain.length || chain.length < 2) {
          throw new Error('Invalid Validator options')
        }
        this.linkChain(chain[0], chain[1])
      })
    } else {
      Object.keys(options).forEach(field => this.linkChain(field, options[field]))
    }
  }

  _mergeStrategy(strategy) {
    if (!strategy) {
      return defaultStrategy
    }
    const todo = {}
    if (strategy.lazy !== undefined) {
      todo.lazy = Boolean(strategy.lazy)
    }
    if (strategy.strict !== undefined) {
      todo.strict = Boolean(strategy.strict)
    }
    return {
      ...defaultStrategy,
      ...todo
    }
  }

  linkChain(field, rules) {
    if (Object.prototype.toString.call(rules) !== '[object Array]') {
      throw new Error('Invalid Validator chain rules')
    }
    if (!field) {
      throw new Error('Invalid Validator chain field')
    }
    this._stack.push({
      field,
      rules: rules.length ? rules : [{}]
    })
  }

  validate(target, strategy) {
    if (!target) {
      throw new Error('Invalid object')
    }
    let i = -1
    let valid = true // 总校验结果
    const { lazy, strict } = this._mergeStrategy(strategy)
    const info = {}
    const invalidFields = []
    while (++i < this._stack.length) {
      let j = -1
      let fieldValid = true
      const { field, rules } = this._stack[i]
      while (++j < rules.length) {
        // const rule = rules[j]
        if (!strict && target[field] === undefined) {
          continue
        }
        const result = this.validateRule(target[field], rules[j])
        info[field] = result
        if (!result.result) {
          invalidFields.push(field)
          valid = false
          fieldValid = false
          break
        }
      }
      if (lazy && !fieldValid) {
        break
      }
    }
    return {
      result: valid,
      invalidFields,
      info
    }
  }

  // 先type 再required 再test 再validator
  validateRule(value, rule) {
    function getResult(result, message = '') {
      return { result, message, value }
    }
    const ruleMessage = rule.message || ''
    const type = rule.type
    const success = getResult(true)
    const fail = getResult(false, ruleMessage)
    if (type && !(value instanceof type)) {
      return fail
    }
    if (rule.required) {
      if (value === undefined || (typeof value === 'string' && !value)) {
        return fail
      }
      if (value === null && !type) {
        return fail
      }
    }
    if (rule.test instanceof RegExp && (value === undefined || (rule.not ? rule.test.test(value) : !rule.test.test(value)))) {
      return fail
    }
    if (typeof rule.validator === 'function') {
      const message = rule.validator.call(null, value)
      if (message !== undefined) {
        if (typeof message !== 'string') {
          if (message.result !== undefined) {
            return getResult(Boolean(message.result), message.message ? String(message.message) : '')
          }
          return getResult(Boolean(message), ruleMessage)
        }
        return getResult(false, message)
      }
    }
    return success
  }
}

module.exports = Validator
