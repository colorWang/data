import router from './routers'
//const whiteList = ['/login'] // no redirect whitelist
router.beforeEach((to, from, next) => {
    const isLogin = sessionStorage.getItem('loginData')
    if (isLogin) {
        next()
    } else {
        //next('/error')
        if (to.path === '/login') { //这就是跳出循环的关键
           next()
        } else {
            next('/login')
        }
    } 
})

router.afterEach(() => {
})