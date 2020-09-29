import { createRouter, createWebHistory } from "vue-router";
import index from "./pages/index.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "index",
      component: index,
    },
    {
      path: "/botex",
      name: "botex",
      component: () => import(/* webpackChunkName: "Page2" */ "./pages/botex.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  console.log({to, from});
  next();
});