import type { App } from "vue"

import permission from './permission'


export default (app: App) => {
	app.directive('permission', permission)
}
