<template>
  <div id="app" class="container">
    <nav class="nav">
      <ul class="nav-menu">
        <li class="nav-item">
          <router-link to="/">Главная</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/botex">Чаты</router-link>
        </li>
        <li class="nav-item avatar">
          <a class="nav-link p-0" href="#">
            <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-5.jpg" class="rounded-circle z-depth-0"
                 alt="avatar image" height="35">
          </a>
        </li>
      </ul>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/less/main.less';

export default {
  name: "App",
}
</script>