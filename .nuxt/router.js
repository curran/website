import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _283ac100 = () => import('../pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)
const _3e3b97ab = () => import('../pages/vibes.vue' /* webpackChunkName: "pages/vibes" */).then(m => m.default || m)
const _2bb8d1ab = () => import('../pages/bookmarks.vue' /* webpackChunkName: "pages/bookmarks" */).then(m => m.default || m)
const _358f3c9e = () => import('../pages/donate.vue' /* webpackChunkName: "pages/donate" */).then(m => m.default || m)
const _6a135938 = () => import('../pages/shop.vue' /* webpackChunkName: "pages/shop" */).then(m => m.default || m)
const _7d26e21f = () => import('../pages/blog/_slug.vue' /* webpackChunkName: "pages/blog/_slug" */).then(m => m.default || m)



const scrollBehavior = (to, from, savedPosition) => {
  // SavedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // If no children detected
    if (to.matched.length < 2) {
      // Scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // If one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // If link has anchor, scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/",
			component: _283ac100,
			name: "index"
		},
		{
			path: "/vibes",
			component: _3e3b97ab,
			name: "vibes"
		},
		{
			path: "/bookmarks",
			component: _2bb8d1ab,
			name: "bookmarks"
		},
		{
			path: "/donate",
			component: _358f3c9e,
			name: "donate"
		},
		{
			path: "/shop",
			component: _6a135938,
			name: "shop"
		},
		{
			path: "/blog/:slug?",
			component: _7d26e21f,
			name: "blog-slug"
		},
		{
			path: "/shop",
			component: _6a135938,
			name: "shop"
		},
		{
			path: "/vibes",
			component: _3e3b97ab,
			name: "vibes"
		},
		{
			path: "/donate",
			component: _358f3c9e,
			name: "donate"
		}
    ],
    fallback: false
  })
}
