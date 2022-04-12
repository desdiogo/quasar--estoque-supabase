import { boot } from 'quasar/wrappers'
import { VueQueryPlugin } from 'vue-query'

export default boot(({ app }) => {
  app.use(VueQueryPlugin)
})
