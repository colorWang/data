..<template>
  <!--购物车小球-->
  <div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart">12</div>
    <div class="ball-container">
    <div v-for="(ball,index) of balls" :key="index">
    <transition @before-enter="handleBeforeEnter"
        @enter="handleEnter"
        @after-enter="handleAfterEnter">
      <div class="ball" v-show="ball.show" v-bind:css="false"><!--外层盒子-->
        <div class="inner inner-hook"></div> <!--内层盒子-->
      </div>
    </transition>
    </div>
    </div>
  </div>
</template>
.
<script>
import Velocity from 'velocity-animate'
// import CartControl from './components/cartControl.vue'
export default {
  name:'App',
  data() {
    return { // 使用balls存放5个小球，这些小球的默认状态都是不显示的
      balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
      dropBalls: [] // 用dropBalls来存放掉落的小球
    }
  },
  methods: {
    addCart(event){
      this.$nextTick( () => {
        this.drop(event.target)
      })
    },  
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
   
      handleBeforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      handleEnter(el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      handleAfterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
  }
}
</script>
<style>
  *{
     padding: 0;
     margin: 0;
  }
 .ball-container .ball{
    position: fixed;
    left: 32px;
    bottom: 22px;
    z-index: 200;
    transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
 }
 .ball-container .ball .inner{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgb(0, 160, 220);
    transition: all 0.4s linear
 }
  .cart-add{
    position: absolute;
    top:300px;
    right: 100px;
  }   

</style>