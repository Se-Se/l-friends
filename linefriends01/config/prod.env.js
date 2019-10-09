module.exports = {
  NODE_ENV: '"production"',
  BUILD_ENV: JSON.stringify(process.env.BUILD_ENV || 'prod'),
}
