<template>
  <div class="page_nav">
    <ul class="nav-menu f--hlc">
      <li class="flex-1" style="background-color: #7fc3e5"></li>
      <li v-for="v in navData">
        <a :href="v.href" class="three-d">
          {{v.name}}
          <span class="three-d-box">
            <span class="front">{{v.name}}</span>
            <span class="back">{{v.name}}</span>
          </span>
        </a>
      </li>
      <li class="flex-1" style="background-color: #7fc3e5"></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'page_nav',
    props: ['navData'],
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  .page_nav{
    width: 100%;
    height: 50px;
    overflow: hidden;

    .nav-menu {
      width: 100%;
    }

    li {
      height: 50px;
      border-right: 1px solid #94c0be;

      a {
        position: relative;
        color: #fff;
        display: block;
        text-decoration: none;
        font-family: 'sansationregular';
        -webkit-font-smoothing: antialiased;
        -moz-font-smoothing: antialiased;
        font-smoothing: antialiased;
        text-transform: capitalize;
        overflow: visible;
        line-height: 20px;
        font-size: 20px;
        padding: 15px 30px 15px 31px;
        perspective: 200px;
        transition: all .07s linear;
        cursor: pointer;

        &:not(.active):hover .three-d-box,
        &:not(.active):focus .three-d-box {
          transform: translateZ(-25px) rotateX(90deg);
        }

        &:hover .front,  &:hover .back {
          background-color: #51938f;
          background-size: 5px 5px;
          background-position: 0 0, 30px 30px;
          background-image: linear-gradient(45deg, #478480 25%, transparent 25%, transparent 75%, #478480 75%, #478480);
        }
      }

      .three-d-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
        transition: all .3s ease-out;
        transform: translatez(-25px);
        transform-style: preserve-3d;
        pointer-events: none;

        .front, .back {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
          background: #74adaa;
          padding: 15px 30px 15px 31px;
          color: white;
          pointer-events: none;
          box-sizing: border-box;
        }

        .front {
          transform: rotatex(0deg) translatez(25px);
        }

        .back {
          transform: rotatex(-90deg) translatez(25px);
          color: #FFE7C4;
        }
      }
    }
  }
</style>
