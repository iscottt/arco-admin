<template>
  <a-layout class="layout" :class="{ mobile: appStore.hideMenu }">
    <div v-if="navbar" class="layout-navbar">
      <NavBar />
    </div>
    <a-layout>
      <a-layout>
        <a-layout-sider
          v-if="renderMenu"
          v-show="!hideMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{ paddingTop: navbar ? '60px' : '' }"
          :hide-trigger="true"
          @collapse="setCollapsed"
        >
          <div class="menu-wrapper">
            <Menu />
          </div>
        </a-layout-sider>
        <a-drawer
          v-if="hideMenu"
          :visible="drawerVisible"
          placement="left"
          :footer="false"
          mask-closable
          :closable="false"
          @cancel="drawerCancel"
        >
          <template #title>
            <div class="flex-center">
              <img
                src="@/assets/images/logo.png"
                width="20"
                class="mr-2"
                alt=""
              />
              <span>浙江省荣军医院质控平台</span>
            </div>
          </template>
          <Menu />
        </a-drawer>
        <a-layout class="layout-content" :style="paddingStyle">
          <TabBar v-if="appStore.tabBar" />
          <a-layout-content>
            <PageLayout />
          </a-layout-content>
          <Footer v-if="footer" />
        </a-layout>
      </a-layout>
    </a-layout>
  </a-layout>
  <!-- 重置密码 -->
  <a-modal
    v-model:visible="visiblePwd"
    title="重置密码"
    @before-ok="beforeReset"
  >
    <a-form :model="resetForm" ref="resetRef" :rules="resetRules">
      <a-form-item field="password" label="新密码">
        <a-input type="password" v-model="resetForm.password" />
      </a-form-item>
      <a-form-item field="passwordCfr" label="确认密码">
        <a-input type="password" v-model="resetForm.passwordCfr" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, computed, provide } from 'vue';
  import { useAppStore } from '@/store';
  import NavBar from '@/components/navbar/index.vue';
  import Menu from '@/components/menu/index.vue';
  import Footer from '@/components/footer/index.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import { useResponsive } from '@/hooks';
  import PageLayout from './page-layout.vue';
  import { getUserInfo } from '@/utils/auth';
  import { resetUserPassword } from '../api/user';
  import { Message } from '@arco-design/web-vue';

  const appStore = useAppStore();
  useResponsive(true);
  const navbarHeight = `60px`;
  const navbar = computed(() => appStore.navbar);
  const renderMenu = computed(() => appStore.menu);
  const hideMenu = computed(() => appStore.hideMenu);
  const footer = computed(() => appStore.footer);

  interface ResetFormProps {
    password?: string;
    passwordCfr?: string;
  }
  const resetForm = ref<ResetFormProps>({});
  const visiblePwd = ref(false);
  const resetRef = ref();
  const operatorId = ref('');

  const resetRules = {
    password: [{ required: true, message: '密码不能为空' }],
    passwordCfr: [
      { required: true, message: '密码不能为空' },
      {
        validator: (value, cb) => {
          if (value !== resetForm.value.password) {
            cb('两次密码输入不一致');
          }
        },
      },
    ],
  };

  const beforeReset = (done) => {
    resetRef.value.validate(async (errors) => {
      if (!errors) {
        console.log('resetForm.value', operatorId.value);
        const { operatorId: storageOperatorId } = getUserInfo();
        const params = {
          password: resetForm.value.password,
          operatorId: operatorId.value || storageOperatorId,
        };
        await resetUserPassword(params);
        Message.success('操作成功！');
        done();
      }
    });
  };

  provide('togglePwd', (operId) => {
    visiblePwd.value = true;
    operatorId.value = operId;
  });

  const menuWidth = computed(() => {
    return appStore.menuCollapse ? 48 : appStore.menuWidth;
  });
  const collapsed = computed(() => {
    return appStore.menuCollapse;
  });
  const paddingStyle = computed(() => {
    const paddingLeft =
      renderMenu.value && !hideMenu.value
        ? { paddingLeft: `${menuWidth.value}px` }
        : {};
    const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
    return { ...paddingLeft, ...paddingTop };
  });
  const setCollapsed = (val: boolean) => {
    appStore.updateSettings({ menuCollapse: val });
  };

  const drawerVisible = ref(false);
  const drawerCancel = () => {
    drawerVisible.value = false;
  };
  provide('toggleDrawerMenu', () => {
    drawerVisible.value = !drawerVisible.value;
  });
</script>

<style scoped lang="less">
  @nav-size-height: 60px;
  @layout-max-width: 1100px;

  .layout {
    width: 100%;
    height: 100%;
  }

  .layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: @nav-size-height;
  }

  .layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    &::after {
      position: absolute;
      top: 0;
      right: -1px;
      display: block;
      width: 1px;
      height: 100%;
      background-color: var(--color-border);
      content: '';
    }

    > :deep(.arco-layout-sider-children) {
      overflow-y: hidden;
    }
  }

  .menu-wrapper {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    :deep(.arco-menu) {
      ::-webkit-scrollbar {
        width: 12px;
        height: 4px;
      }

      ::-webkit-scrollbar-thumb {
        border: 4px solid transparent;
        background-clip: padding-box;
        border-radius: 7px;
        background-color: var(--color-text-4);
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: var(--color-text-3);
      }
    }
  }

  .layout-content {
    min-height: 100vh;
    overflow-y: hidden;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  }
</style>
