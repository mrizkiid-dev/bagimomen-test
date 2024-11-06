<template>
  <div id="loading"></div>
  <div id="pop-up"></div>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications :ui="{ strategy: 'override', position: 'top-0 right-0' }"/>
  </div>
</template>