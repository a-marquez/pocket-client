module.exports = async (ctx) => {
  ctx.session = {}
  ctx.redirect('/')
}
