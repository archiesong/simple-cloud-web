import { defineStore } from 'pinia'

export const useTagsViewStore = defineStore('tagsView', () => {
  // addView(view) {
  //   this.addVisitedView(view);
  //   this.addCachedView(view);
  // },
  // addVisitedView(view) {
  //   if (this.visitedViews.some((v) => v.path === view.path)) return;
  //   this.visitedViews.push(
  //     Object.assign({}, view, {
  //       title: view.meta.title || "no-name",
  //     })
  //   );
  // },
  // addCachedView(view) {
  //   if (this.cachedViews.includes(view.name)) return;
  //   if (!view.meta.noCache) {
  //     this.cachedViews.push(view.name);
  //   }
  // },
  // delView(view) {
  //   return new Promise((resolve) => {
  //     this.delVisitedView(view);
  //     this.delCachedView(view);
  //     resolve({
  //       visitedViews: [...this.visitedViews],
  //       cachedViews: [...this.cachedViews],
  //     });
  //   });
  // },
  // delVisitedView(view) {
  //   return new Promise((resolve) => {
  //     for (const [i, v] of this.visitedViews.entries()) {
  //       if (v.path === view.path) {
  //         this.visitedViews.splice(i, 1);
  //         break;
  //       }
  //     }
  //     resolve([...this.visitedViews]);
  //   });
  // },
  // delCachedView(view) {
  //   return new Promise((resolve) => {
  //     const index = this.cachedViews.indexOf(view.name);
  //     index > -1 && this.cachedViews.splice(index, 1);
  //     resolve([...this.cachedViews]);
  //   });
  // },
  const visitedViews = shallowRef([])
  const cachedViews = shallowRef([])
  return {
    visitedViews,
    cachedViews,
  }
})