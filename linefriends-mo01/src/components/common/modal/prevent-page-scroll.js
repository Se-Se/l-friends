let preventDefault = e => {
  return e.preventDefault()
}

export default {
  prevent () {
    document.body.addEventListener('scroll', preventDefault, false)
    document.body.addEventListener('touchmove', preventDefault, { passive: false })
  },
  recover () {
    document.body.removeEventListener('scroll', preventDefault, false)
    document.body.removeEventListener('touchmove', preventDefault, { passive: false })
  }
}
