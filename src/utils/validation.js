export function validateCardPayment(card) {
  const errors = {}
  const cardNumber = (card?.cardNumber || '').replace(/\s/g, '')
  const cardName = (card?.cardName || '').trim()
  const expiryMonth = (card?.expiryMonth || '').trim()
  const expiryYear = (card?.expiryYear || '').trim()
  const cvv = (card?.cvv || '').trim()

  if (!cardNumber) {
    errors.cardNumber = 'Card number is required'
  } else if (!/^\d{16}$/.test(cardNumber)) {
    errors.cardNumber = 'Enter a valid 16-digit card number'
  }

  if (!cardName) {
    errors.cardName = 'Name on card is required'
  } else if (cardName.length < 3) {
    errors.cardName = 'Name must be at least 3 characters'
  } else if (!/^[a-zA-Z\s'.-]+$/.test(cardName)) {
    errors.cardName = 'Name can only contain letters'
  }

  if (!expiryMonth) {
    errors.expiryMonth = 'Expiry month is required'
  } else if (!/^(0[1-9]|1[0-2])$/.test(expiryMonth)) {
    errors.expiryMonth = 'Enter a valid month (01–12)'
  }

  if (!expiryYear) {
    errors.expiryYear = 'Expiry year is required'
  } else if (!/^\d{2}$/.test(expiryYear)) {
    errors.expiryYear = 'Enter a 2-digit year (e.g. 28)'
  }

  if (
    expiryMonth &&
    expiryYear &&
    /^(0[1-9]|1[0-2])$/.test(expiryMonth) &&
    /^\d{2}$/.test(expiryYear)
  ) {
    const year = 2000 + parseInt(expiryYear, 10)
    const month = parseInt(expiryMonth, 10)
    const expiryEnd = new Date(year, month, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (expiryEnd < today) {
      errors.expiryMonth = 'Card has expired'
      errors.expiryYear = 'Card has expired'
    }
  }

  if (!cvv) {
    errors.cvv = 'CVV is required'
  } else if (!/^\d{3,4}$/.test(cvv)) {
    errors.cvv = 'Enter a valid 3 or 4 digit CVV'
  }

  return errors
}

export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export function validateCheckoutForm(form, payment, cardDetails = null) {
  const errors = {}

  const firstName = form.firstName.trim()
  const lastName = form.lastName.trim()
  const phone = form.phone.trim().replace(/\s/g, '')
  const address = form.address.trim()

  if (!firstName) {
    errors.firstName = 'First name is required'
  } else if (firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
    errors.firstName = 'First name can only contain letters'
  }

  if (!lastName) {
    errors.lastName = 'Last name is required'
  } else if (lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
    errors.lastName = 'Last name can only contain letters'
  }

  if (!phone) {
    errors.phone = 'Phone number is required'
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number'
  }

  if (!address) {
    errors.address = 'Complete address is required'
  } else if (address.length < 10) {
    errors.address = 'Address must be at least 10 characters'
  }

  if (!form.date) {
    errors.date = 'Delivery date is required'
  } else {
    const selected = new Date(form.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selected < today) {
      errors.date = 'Delivery date cannot be in the past'
    }
  }

  if (!form.time) {
    errors.time = 'Preferred time is required'
  }

  if (!payment) {
    errors.payment = 'Please select a payment method'
  } else if (payment === 'online') {
    Object.assign(errors, validateCardPayment(cardDetails))
  }

  return errors
}

export function validateRegister(data) {
  const errors = {}
  const fullName = data.fullName.trim()
  const email = data.email.trim().toLowerCase()
  const phone = data.phone.trim().replace(/\s/g, '')
  const password = data.password
  const confirmPassword = data.confirmPassword

  if (!fullName || fullName.length < 3) {
    errors.fullName = 'Full name must be at least 3 characters'
  }

  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!phone) {
    errors.phone = 'Phone number is required'
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (data.address.trim() && data.address.trim().length < 10) {
    errors.address = 'Address must be at least 10 characters'
  }

  return errors
}

export function validateLogin(data) {
  const errors = {}
  const email = data.email.trim().toLowerCase()
  const password = data.password

  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  }

  return errors
}

export function getMinDeliveryDate() {
  return new Date().toISOString().split('T')[0]
}
