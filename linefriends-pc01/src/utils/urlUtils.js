export function goUrl (url) {
  if (opener) {
    opener.location.href = url
    self.close()
  } else {
    location.href = url
  }
}
