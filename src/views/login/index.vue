<template>
  <div class="container">
    <div class="content">
      <a-card class="py-6 px-3 rounded-5px">
        <LoginForm />
      </a-card>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';

  import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    width: 100vw;
    max-width: initial;
    height: 100vh;
    background-image: url('@/assets/images/login_bg.svg');
    background-position: 50%;
    background-size: 100% 100%;
    background-size: cover;
    background-color: #f0f2f5;

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }
</style>

<style lang="less" scoped></style>
